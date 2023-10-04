import db from "@/backend/database/database";

export async function checkDbHealth(): Promise<boolean> {
    return await db.$queryRaw`SELECT 1`
        .then(() => true)
        .catch(() => {
            console.error('Database health check failed');
            return false;
        });
}