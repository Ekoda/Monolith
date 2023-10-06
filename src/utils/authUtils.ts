import {NextApiRequest} from "next";
import {getSession} from "next-auth/react";

interface SessionUser {
    name?: string | null | undefined,
    email?: string | null | undefined,
    image?: string | null | undefined
}

export async function getSessionUser(req: NextApiRequest): Promise<SessionUser | null> {
    const session = await getSession({req});
    if (session?.user?.email) {
        return session.user;
    }
    return null;
}

export async function isSignedIn(req: NextApiRequest): Promise<boolean> {
    const user = await getSessionUser(req);
    return !!user;
}