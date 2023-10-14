import {NextApiRequest, NextApiResponse} from "next";
import {internalError500, methodNotAllowed405, ok200, or403, or404} from "@/utils/apiUtils";
import {findUserByEmail} from "@/backend/services/userService";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";


export default async function (req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    or403(res, !!session, "You must be signed in to view this")

    switch (req.method) {
        case "GET":
            return findUserByEmail(session?.user?.email as string)
                .then(user => or404(res, user))
                .then(user => ok200(res, user))
                .catch(error => internalError500(res, error.message));

        default:
            return methodNotAllowed405(res)
    }
}