import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {logger} from "@/backend/logging";
import {withAuth} from "@/backend/auth/withAuth";

jest.mock("next-auth", () => ({getServerSession: jest.fn()}));
// Avoid loading the real NextAuth config (and with it Prisma) in unit tests
jest.mock("@/pages/api/auth/[...nextauth]", () => ({authOptions: {}}));
jest.mock("@/backend/logging", () => ({
    logger: {log: jest.fn(() => Promise.resolve())},
}));

const mockSession = getServerSession as jest.Mock;

function mockRes() {
    const res = {
        statusCode: 200,
        body: undefined as unknown,
        headersSent: false,
        status(code: number) {
            res.statusCode = code;
            return res;
        },
        json(body: unknown) {
            res.body = body;
            res.headersSent = true;
            return res;
        },
    };
    return res;
}

const req = {method: "GET", url: "/api/test"} as NextApiRequest;

describe("withAuth", () => {
    beforeEach(() => {
        mockSession.mockReset();
        (logger.log as jest.Mock).mockClear();
    });

    it("returns 401 and skips the handler when there is no session", async () => {
        mockSession.mockResolvedValue(null);
        const handler = jest.fn();
        const res = mockRes();

        await withAuth(handler)(req, res as unknown as NextApiResponse);

        expect(res.statusCode).toBe(401);
        expect(handler).not.toHaveBeenCalled();
    });

    it("returns 401 when the session has no email", async () => {
        mockSession.mockResolvedValue({user: {name: "No Email"}, expires: ""});
        const handler = jest.fn();
        const res = mockRes();

        await withAuth(handler)(req, res as unknown as NextApiResponse);

        expect(res.statusCode).toBe(401);
        expect(handler).not.toHaveBeenCalled();
    });

    it("passes the signed-in user to the handler", async () => {
        const session = {user: {email: "a@example.com", name: "Alice"}, expires: ""};
        mockSession.mockResolvedValue(session);
        const res = mockRes();

        await withAuth((_req, res, {user}) => {
            res.status(200).json({email: user.email, name: user.name});
        })(req, res as unknown as NextApiResponse);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({email: "a@example.com", name: "Alice"});
    });

    it("turns unhandled errors into a logged, generic 500", async () => {
        mockSession.mockResolvedValue({user: {email: "a@example.com"}, expires: ""});
        const res = mockRes();

        await withAuth(async () => {
            throw new Error("db password is wrong");
        })(req, res as unknown as NextApiResponse);

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({error: "Internal server error"});
        expect(logger.log).toHaveBeenCalledWith(expect.objectContaining({level: "error"}));
    });

    it("does not send a second response if the handler already responded before throwing", async () => {
        mockSession.mockResolvedValue({user: {email: "a@example.com"}, expires: ""});
        const res = mockRes();

        await withAuth(async (_req, res) => {
            res.status(200).json({ok: true});
            throw new Error("after send");
        })(req, res as unknown as NextApiResponse);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ok: true});
    });
});
