import {NextApiRequest, NextApiResponse} from "next";
import {forbidden403, internalError500, methodNotAllowed405, ok200, or404} from "@/utils/apiUtils";
import {userSignedIn} from "@/utils/authUtils";
import {findUserById} from "@/backend/services/userService";


export default async function (req: NextApiRequest, res: NextApiResponse) {
    const signedIn = await userSignedIn(req, res);
    if (!signedIn) {
        return forbidden403(res, "You must be signed in");
    }

    switch (req.method) {
        case "GET":
            return findUserById(req.query.id as string)
                .then(user => or404(res, user))
                .then(user => ok200(res, user))
                .catch(error => internalError500(res, error.message));

        default:
            return methodNotAllowed405(res)
    }
}