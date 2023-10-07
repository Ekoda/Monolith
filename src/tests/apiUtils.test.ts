import fetchMock from "jest-fetch-mock";
import {logger} from "@/backend/logging";
import {fetchOrThrow, sanitizeHeaders} from "@/utils/apiUtils";

fetchMock.enableMocks();

jest.mock("@/backend/logging", () => ({
    logger: {
        log: jest.fn(() => Promise.resolve())
    },
}));

describe("fetchOrThrow", () => {

    beforeEach(() => {
        fetchMock.resetMocks();
        (logger.log as jest.Mock).mockClear();
    });

    it("returns the response when the status code indicates success", async () => {
        const mockResponse = { ok: true, status: 200 };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const response = await fetchOrThrow("/success-url");

        expect(response.ok).toBe(true);
        expect(response.status).toBe(200);
    });

    it("logs an error and throws when the status code indicates an error", async () => {
        const mockResponse = { ok: false, status: 404, statusText: "Not Found" };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 404, statusText: "Not Found" });

        await expect(fetchOrThrow("/error-url")).rejects.toThrow("HTTP error: 404 Not Found");
        expect(logger.log).toHaveBeenCalledWith(
            expect.objectContaining({
                level: "error",
                message: "HTTP error: 404 Not Found",
            })
        );
    });

});

describe("sanitizeHeaders", () => {

    it("should return undefined when headers is undefined", () => {
        expect(sanitizeHeaders(undefined)).toBeUndefined();
    });

    describe("when headers is an instance of Headers", () => {
        let headers: Headers;

        beforeEach(() => {
            headers = new Headers({
                Authorization: "Bearer token",
                Cookie: "session_id=abc123",
                "Content-Type": "application/json"
            });
        });

        it("should sanitize sensitive headers", () => {
            const sanitizedHeaders = sanitizeHeaders(headers) as Headers;
            expect(sanitizedHeaders.get("Authorization")).toBe("***");
            expect(sanitizedHeaders.get("Cookie")).toBe("***");
            expect(sanitizedHeaders.get("Content-Type")).toBe("application/json");
        });
    });

    describe("when headers is an array", () => {
        const headers = [
            ["Authorization", "Bearer token"],
            ["Cookie", "session_id=abc123"],
            ["Content-Type", "application/json"]
        ];

        it("should sanitize sensitive headers", () => {
            const sanitizedHeaders = sanitizeHeaders(headers as [string, string][]);
            expect(sanitizedHeaders).toEqual([
                ["Authorization", "***"],
                ["Cookie", "***"],
                ["Content-Type", "application/json"]
            ]);
        });
    });

    describe("when headers is a Record<string, string>", () => {
        const headers = {
            Authorization: "Bearer token",
            Cookie: "session_id=abc123",
            "Content-Type": "application/json"
        };

        it("should sanitize sensitive headers", () => {
            const sanitizedHeaders = sanitizeHeaders(headers);
            expect(sanitizedHeaders).toEqual({
                Authorization: "***",
                Cookie: "***",
                "Content-Type": "application/json"
            });
        });
    });

});