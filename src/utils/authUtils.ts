import {getServerSession} from "next-auth";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";

interface SessionUser {
    name?: string | null | undefined,
    email?: string | null | undefined,
    image?: string | null | undefined
}

export async function getUser(req: NextApiRequest): Promise<SessionUser | null> {
    const session = await getSession({req});
    if (session?.user?.email) {
        return session.user;
    }
    return null;
}

export async function userSignedIn(req: NextApiRequest): Promise<boolean> {
    const user = await getUser(req);
    return !!user;
}