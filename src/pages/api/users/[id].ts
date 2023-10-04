import {NextApiRequest, NextApiResponse} from "next";
import {fetchUserById} from "@/backend/controllers/userController";
import {internalError500, methodNotAllowed405, ok200, or404} from "@/utils/api";


export default function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET":
            return fetchUserById(req.query.id as string)
                .then(user => or404(res, user))
                .then(user => ok200(res, user))
                .catch(error => internalError500(res, error.message));

        default: methodNotAllowed405(res)
    }
}