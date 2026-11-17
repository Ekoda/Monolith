import fetchMock from "jest-fetch-mock";
import {logger} from "@/backend/logging";
import {fetchJson, fetchOrThrow, HttpError, sanitizeHeaders} from "@/utils/apiUtils";

fetchMock.enableMocks();

jest.mock("@/backend/logging", () => ({
    logger: {
        log: jest.fn(() => Promise.resolve())
    },
}));

function lastRequestInit(): RequestInit {
    return fetchMock.mock.calls[fetchMock.mock.calls.length - 1][1] as RequestInit;
}

describe("fetchOrThrow", () => {

    beforeEach(() => {
        fetchMock.resetMocks();
        (logger.log as jest.Mock).mockClear();
    });

    it("returns the response when the status code indicates success", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ok: true}));

        const response = await fetchOrThrow("/success-url");

        expect(response.ok).toBe(true);
        expect(response.status).toBe(200);
    });

    it("throws an HttpError with status and parsed JSON body", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({error: "User not found"}), {
            status: 404, statusText: "Not Found", headers: {"Content-Type": "application/json"}
        });

        const error = await fetchOrThrow("/missing").catch(e => e);

        expect(error).toBeInstanceOf(HttpError);
        expect(error.status).toBe(404);
        expect(error.body).toEqual({error: "User not found"});
        expect(error.message).toBe("HTTP error: 404 Not Found - User not found");
    });

    it("logs failures only when logError is set, without the request body", async () => {
        fetchMock.mockResponse("boom", {status: 500, statusText: "Internal Server Error"});

        await expect(fetchOrThrow("/a")).rejects.toThrow(HttpError);
        expect(logger.log).not.toHaveBeenCalled();

        await expect(fetchOrThrow("/a", {
            method: "POST",
            body: JSON.stringify({password: "hunter2"}),
            headers: {authorization: "Bearer secret"},
            logError: true,
        })).rejects.toThrow("HTTP error: 500 Internal Server Error");

        const entry = (logger.log as jest.Mock).mock.calls[0][0];
        expect(entry.level).toBe("error");
        expect(entry.metadata.request.body).toBeUndefined();
        expect(entry.metadata.request.headers.get("authorization")).toBe("***");
        expect(entry.metadata.response.body).toBe("boom");
    });

    it("sets JSON Content-Type for string bodies only", async () => {
        fetchMock.mockResponse("{}");

        await fetchOrThrow("/json", {method: "POST", body: JSON.stringify({a: 1})});
        expect(new Headers(lastRequestInit().headers).get("Content-Type")).toBe("application/json");

        await fetchOrThrow("/form", {method: "POST", body: new FormData()});
        expect(new Headers(lastRequestInit().headers).get("Content-Type")).toBeNull();

        await fetchOrThrow("/get");
        expect(new Headers(lastRequestInit().headers).get("Content-Type")).toBeNull();
    });

    it("keeps caller headers of any shape, including a Headers instance", async () => {
        fetchMock.mockResponse("{}");

        await fetchOrThrow("/h", {headers: new Headers({"X-Trace": "abc"}), body: "{}", method: "POST"});
        const sent = new Headers(lastRequestInit().headers);
        expect(sent.get("X-Trace")).toBe("abc");
        expect(sent.get("Content-Type")).toBe("application/json");

        await fetchOrThrow("/h", {headers: {"Content-Type": "text/plain"}, body: "hi", method: "POST"});
        expect(new Headers(lastRequestInit().headers).get("Content-Type")).toBe("text/plain");
    });

    it("aborts after timeoutMs", async () => {
        fetchMock.mockResponseOnce((req) => new Promise((resolve, reject) => {
            req.signal.addEventListener("abort", () => reject(req.signal.reason));
            setTimeout(() => resolve("{}"), 1000);
        }));

        await expect(fetchOrThrow("/slow", {timeoutMs: 20})).rejects.toThrow();
    });
});

describe("fetchJson", () => {
    beforeEach(() => fetchMock.resetMocks());

    it("parses JSON", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({id: 1}));
        await expect(fetchJson<{id: number}>("/x")).resolves.toEqual({id: 1});
    });

    it("returns undefined for an empty body", async () => {
        fetchMock.mockResponseOnce("", {status: 204});
        await expect(fetchJson("/x")).resolves.toBeUndefined();
    });
});

describe("sanitizeHeaders", () => {

    it("should return undefined when headers is undefined", () => {
        expect(sanitizeHeaders(undefined)).toBeUndefined();
    });

    it("redacts a Headers instance without mutating it", () => {
        const headers = new Headers({
            Authorization: "Bearer token",
            Cookie: "session_id=abc123",
            "Content-Type": "application/json"
        });

        const sanitized = sanitizeHeaders(headers) as Headers;

        expect(sanitized.get("Authorization")).toBe("***");
        expect(sanitized.get("Cookie")).toBe("***");
        expect(sanitized.get("Content-Type")).toBe("application/json");
        expect(headers.get("Authorization")).toBe("Bearer token");
    });

    it("redacts an array of headers", () => {
        const headers: [string, string][] = [
            ["Authorization", "Bearer token"],
            ["Cookie", "session_id=abc123"],
            ["Content-Type", "application/json"]
        ];

        expect(sanitizeHeaders(headers)).toEqual([
            ["Authorization", "***"],
            ["Cookie", "***"],
            ["Content-Type", "application/json"]
        ]);
    });

    it("redacts a record case-insensitively", () => {
        const headers = {
            authorization: "Bearer token",
            "X-API-Key": "key",
            Cookie: "session_id=abc123",
            "Content-Type": "application/json"
        };

        expect(sanitizeHeaders(headers)).toEqual({
            authorization: "***",
            "X-API-Key": "***",
            Cookie: "***",
            "Content-Type": "application/json"
        });
    });

});
