# Monolith

<!--LLM-->
A full-stack starter for shipping an idea as a single app: Next.js (pages router) for the frontend and API, PostgreSQL + Prisma for data, NextAuth for sign-in, and MUI with a token-driven theme for the UI. Frontend, backend and database schema live in one repository and deploy as one unit.
<!--LLM-->

**Stack:** Next.js · React · TypeScript · Prisma · PostgreSQL · NextAuth · MUI · Jest

## Quick start

You need Node 20+ and Docker (for the local database).

```bash
bash setup.sh
```

```bash
npm run dev
```

`setup.sh` installs dependencies, writes `.env.local`, starts Postgres in Docker, runs the migrations and asks for your Google OAuth keys (you can skip those). Then open [http://localhost:3000](http://localhost:3000).

<details>
<summary>Manual setup</summary>

1. `npm install`
2. Create `.env.local`:
   ```env
   DATABASE_URL=postgresql://monolith:monolith@localhost:5432/monolith
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=   # openssl rand -base64 32
   GOOGLE_ID=
   GOOGLE_SECRET=
   ```
3. `npm run db:up` to start Postgres, then `npm run migrate:dev` to apply the migrations.
4. `npm run dev`

</details>

### Google sign-in

The app runs without it: every page is public unless it asks for a signed-in user. To turn sign-in on:

1. In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an **OAuth client ID** of type *Web application*.
2. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI (plus your production URL later).
3. Put the client ID and secret in `GOOGLE_ID` and `GOOGLE_SECRET` in `.env.local`.

To add other providers (Apple, Facebook, email/password), register them in `src/pages/api/auth/[...nextauth].ts` and switch on the matching flag in `src/config/auth.ts`.

## Workflow

**Day to day**

```bash
npm run db:up   # start Postgres (once per boot)
```

```bash
npm run dev     # app on http://localhost:3000
```

```bash
npm test        # Jest tests in src/tests
```

```bash
npm run lint
```

**Adding a feature, end to end**

1. **Data:** edit `src/backend/database/schema.prisma`, then create a migration:
   ```bash
   npm run migrate:dev -- --name add_projects
   ```
   Commit the generated folder in `src/backend/database/migrations/`; migrations are part of the code.
2. **Logic:** put database and domain logic in `src/backend/services/`.
3. **API:** add a route in `src/pages/api/`. Wrap it in `withAuth` if it needs a signed-in user:
   ```ts
   export default withAuth(async (req, res, { user }) => {
       return ok200(res, await findUserByEmail(user.email));
   });
   ```
4. **Client:** add a fetch function in `src/services/apiService.ts` and call it from a page with the `useFetch` hook.
5. **UI:** add a page in `src/pages/`. Pages are public by default; to make one sign-in only:
   ```tsx
   export default function Dashboard() { /* ... */ }
   Dashboard.requireAuth = true;
   ```

**Restyling**

The whole look is driven by a few tokens at the top of `src/styles/theme.ts`: brand colour, corner radius, font and the grey scale. Change those first; component-level tweaks live further down the same file. Light mode is the default, and the navbar has a dark-mode toggle.

**Deploying**

Any Node host works; Vercel is the simplest. Use any hosted Postgres (Neon, Supabase, Vercel Postgres) and set the same env vars there, with `NEXTAUTH_URL` set to your public URL. Apply migrations as part of the build:

```bash
npm run migrate:deploy && npm run build
```

Never run `migrate:dev` against production. To migrate production from your machine, put its env vars in `.env.production` and run `npm run migrate:deploy:production`.

## Where things live

```
src/
├── pages/                 Routes. Each file is a page; _app.tsx wires up theme, session and navbar
│   └── api/               API routes (auth, health, users)
├── components/            Shared UI: Navbar, Logo, LoginBox, SessionWrapper, ColorModeToggle
├── styles/theme.ts        Design tokens and MUI theme (light + dark)
├── services/apiService.ts Client-side fetch functions and the useFetch hook
├── config/                App title and which sign-in methods are enabled
├── backend/
│   ├── auth/withAuth.ts   Guard for API routes that need a signed-in user
│   ├── controllers/       Request handling shared by API routes
│   ├── services/          Database and domain logic
│   ├── database/          Prisma schema, migrations, client (generated/ is git-ignored)
│   ├── integrations/      One folder per third-party API, with an example
│   ├── pubsub.ts          Publish/subscribe interface (swap in Google Pub/Sub, RabbitMQ, ...)
│   └── logging.ts         Structured logger interface
├── utils/                 Small helpers (API responses, errors, time)
└── tests/                 Jest tests
```

Configuration lives at the root: `prisma.config.ts` (schema and migration paths), `docker-compose.yml` (local Postgres) and `.env.local` (secrets, not committed).

## Notes

Monolith started as a personal template and reflects personal choices of tools. It aims to stay small and easy to read: take what's useful, delete what isn't.
