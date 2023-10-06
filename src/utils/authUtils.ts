import {getServerSession} from "next-auth";
import {NextApiRequest, NextApiResponse} from "next";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

interface SessionUser {
    name?: string | null | undefined,
    email?: string | null | undefined,
    image?: string | null | undefined
}

export async function userSignedIn(req: NextApiRequest, res: NextApiResponse): Promise<SessionUser | null> {
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.email) {
        return session.user;
    }
    return null;
}