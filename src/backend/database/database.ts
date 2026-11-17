import { PrismaClient } from "@/backend/database/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {logger} from "@/backend/logging";


const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    // Prisma 7 talks to Postgres through the `pg` driver. Pool options (max, timeouts, ssl)
    // go here; for Supabase/Neon on serverless, use their pooled connection string.
    const adapter = new PrismaPg({ connectionString });

    const client = new PrismaClient({
        adapter,
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
