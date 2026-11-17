import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {internalError500, unauthorized401} from "@/utils/apiUtils";
import {logger} from "@/backend/logging";

/** The signed-in user. `email` is guaranteed, since it is how users are keyed in the database. */
export interface AuthedUser {
    email: string;
    name?: string | null;
    image?: string | null;
}

export interface AuthContext {
    user: AuthedUser;
    session: Session;
}

export type AuthedHandler = (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: AuthContext
) => unknown | Promise<unknown>;

/**
 * Wraps an API route so it only runs for signed-in users.
 * - No session (or no email on it) → 401, the handler never runs
 * - Unhandled errors → logged and turned into a generic 500 (no internals leak to the client)
 *
 * Usage:
 *   export default withAuth(async (req, res, {user}) => {
 *       if (req.method !== "GET") return methodNotAllowed405(res);
 *       return ok200(res, await findUserByEmail(user.email));
 *   });
 */
export function withAuth(handler: AuthedHandler): NextApiHandler {
    return async (req, res) => {
        const session = await getServerSession(req, res, authOptions);
        const email = session?.user?.email;
        if (!session || !email) {
            return unauthorized401(res, "You must be signed in");
        }

        try {
            await handler(req, res, {session, user: {...session.user, email}});
        } catch (e) {
            await logger.log({
                level: "error",
                message: `Unhandled error in ${req.method} ${req.url}`,
                error: e instanceof Error ? e : new Error(String(e)),
            });
            if (!res.headersSent) {
                internalError500(res);
            }
        }
    };
}
