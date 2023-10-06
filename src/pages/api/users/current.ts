import {NextApiRequest, NextApiResponse} from "next";
import {internalError500, methodNotAllowed405, ok200, or403, or404} from "@/utils/apiUtils";
import {userSignedIn} from "@/utils/authUtils";
import {findUserByEmail} from "@/backend/services/userService";
import {validatePresent} from "@/utils/errorUtils";


export default async function (req: NextApiRequest, res: NextApiResponse) {
    const signedIn = await userSignedIn(req, res);
    or403(res, !!signedIn, "You must be signed in to view this")

    switch (req.method) {
        case "GET":
            return findUserByEmail(signedIn?.email as string)
                .then(user => or404(res, user))
                .then(user => ok200(res, user))
                .catch(error => internalError500(res, error.message));

        default:
            return methodNotAllowed405(res)
    }
}