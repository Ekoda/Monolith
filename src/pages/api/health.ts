import {NextApiRequest, NextApiResponse} from "next";
import {internalError500, methodNotAllowed405, ok200} from "@/utils/apiUtils";
import {checkDbHealth} from "@/backend/controllers/healthController";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET":
            const dbHealth = await checkDbHealth();
            if(dbHealth) {
                return ok200(res, {status: "ok"});
            } else {
                internalError500(res, "Database health check failed")
            }
        default:
            return methodNotAllowed405(res)
    }
}