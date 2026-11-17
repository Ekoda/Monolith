import { defineConfig } from "prisma/config";

// Env vars are not loaded here on purpose: the npm scripts load the right file
// (e.g. `dotenv -e .env.local`), and on Vercel they come from the project settings.
// That way a production migration can never silently fall back to local values.
export default defineConfig({
    schema: "src/backend/database/schema.prisma",
    migrations: {
        path: "src/backend/database/migrations",
    },
    datasource: {
        // process.env (not env()) so `prisma generate` works without a database URL
        url: process.env.DATABASE_URL,
    },
});
