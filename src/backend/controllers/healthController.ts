import db from "@/backend/database/database";
import {logger} from "@/backend/logging";

export async function checkDbHealth(): Promise<boolean> {
    return await db.$queryRaw`SELECT 1`
        .then(() => true)
        .catch(() => {
            logger.log({
                level: 'error',
                message: 'database health check failed'
                })
            return false;
        });
}