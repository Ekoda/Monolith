import {NextApiRequest, NextApiResponse} from "next";
import {internalError500, methodNotAllowed405, notFound404, ok200, unauthorized401} from "@/utils/apiUtils";
import {findUserByEmail} from "@/backend/services/userService";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {logger} from "@/backend/logging";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return methodNotAllowed405(res);
    }

    const session = await getServerSession(req, res, authOptions);
    const email = session?.user?.email;
    if (!email) {
        return unauthorized401(res, "You must be signed in to view this");
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return notFound404(res);
        }
        return ok200(res, user);
    } catch (e) {
        await logger.log({level: "error", message: "Failed to fetch current user", error: e as Error});
        return internalError500(res);
    }
}
