import { PrismaClient } from "@prisma/client";
import {logger} from "@/backend/logging";


const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
    const client = new PrismaClient({
        log: [
            {
                emit: "event",
                level: "error",
            },
        ]
    });

    client.$on("error", (event) => {
        logger
            .log({level: "error", message: event.message})
            .catch(e => console.error("Logging failed", e));
    });

    return client;
}

const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
}

export default db;
