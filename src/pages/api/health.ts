import {NextApiRequest, NextApiResponse} from "next";
import {internalError500, methodNotAllowed405, ok200} from "@/utils/apiUtils";
import {checkDbHealth} from "@/backend/controllers/healthController";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return methodNotAllowed405(res);
    }

    const dbHealth = await checkDbHealth();
    if (!dbHealth) {
        return internalError500(res, "Database health check failed");
    }
    return ok200(res, {status: "ok"});
}
