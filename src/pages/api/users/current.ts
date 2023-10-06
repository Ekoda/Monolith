import {NextApiRequest, NextApiResponse} from "next";
import {internalError500, methodNotAllowed405, ok200, or403, or404} from "@/utils/apiUtils";
import {getUser} from "@/utils/authUtils";
import {findUserByEmail} from "@/backend/services/userService";


export default async function (req: NextApiRequest, res: NextApiResponse) {
    const user = await getUser(req, res);
    or403(res, !!user, "You must be signed in to view this")

    switch (req.method) {
        case "GET":
            return findUserByEmail(user?.email as string)
                .then(user => or404(res, user))
                .then(user => ok200(res, user))
                .catch(error => internalError500(res, error.message));

        default:
            return methodNotAllowed405(res)
    }
}