import db from "@/backend/database/database";
import {logger} from "@/backend/logging";
import {errorEntry} from "@/utils/errorUtils";

export async function checkDbHealth(): Promise<boolean> {
    return await db.$queryRaw`SELECT 1`
        .then(() => true)
        .catch((e) => {
            logger.log(errorEntry(e, "database health check failed"))
            return false;
        });
}