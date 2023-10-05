import {getServerSession} from "next-auth";
import {NextApiRequest, NextApiResponse} from "next";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export async function userSignedIn(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
    const session = await getServerSession(req, res, authOptions)
    return !!session
}