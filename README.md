# Monolith Template
<!--LLM-->
This template provides a structured starting point for building a full-stack monolith application using Next.js, Prisma, and PostgreSQL. It includes an organized backend, a Prisma db schema, and API endpoints structured under the pages directory. Local development runs Postgres in Docker; production can use any hosted Postgres (Vercel Postgres, Supabase, Neon, ...).
<!--LLM-->
## Table of Contents

- [Rapid Development Philosophy](#rapid-development-philosophy)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Authentication](#authentication)
- [Publish-Subscribe System](#publish-subscribe-system)
- [Logging](#logging)
- [Deployment](#deployment)
- [Integrations](#integrations)
- [Notes](#notes)

## Rapid Development Philosophy

The Monolith template facilitates rapid development, ideal for solo developers transitioning ideas into live applications swiftly. Its monorepo architecture consolidates backend and frontend into one repository, promoting:

- **Unified Versioning:** Single repository, unified versioning, simplifying version control and rollback.
- **Atomic Changes:** Enables coordinated updates across multiple components ensuring that changes in the backend and frontend are harmonized, simplifying the development and review processes.
- **Shared Configurations and Libraries:** Easy sharing of common assets across backend and frontend, reducing redundancy.
- **Single Build and Test Environment:** Straightforward CI/CD integrations for a seamless path from development to deployment.
- **Clear Demarcation:** Defined separation between backend and frontend for focused development and easy navigation.
- **Smooth Transition to Scalability:** Transition to robust databases like PostgreSQL and break the app upp with ease as your project scales.

Monolith lowers the threshold from idea to implementation, offering a structured foundation adaptable to evolving project needs, making it apt for solo developers or small teams intent on rapid development.

## Getting Started

Run `setup.sh` to install dependencies and set up a sqlite db for development or follow the steps below to set up the project manually.

1. **Install Dependencies:**
    ```bash
    npm install
    ```

2. **Run Development Server:**
    ```bash
    npm run dev
    ```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application in action. The page auto-updates as you make changes to the code.

4. Start editing by modifying `pages/index.tsx` and explore the structured backend within the `src/backend` directory.

## Database Setup

The template uses PostgreSQL in every environment (SQLite can't run on Vercel's read-only filesystem, and Prisma can't switch provider per environment).

1. Start a local Postgres (or point `DATABASE_URL` in `.env.local` at any Postgres, e.g. Supabase or Neon):
    ```bash
    npm run db:up
    ```
    `.env.local`: `DATABASE_URL=postgresql://monolith:monolith@localhost:5432/monolith`

2. After changing `schema.prisma`, create and apply a migration locally:
    ```bash
    npm run migrate:dev -- --name describe_your_change
    ```
    Commit the generated folder in `src/backend/database/migrations/`. Migrations are part of the code.

3. In production, only ever apply committed migrations (never `migrate dev`):
    ```bash
    npm run migrate:deploy
    ```
    On Vercel you can run this as part of the build by setting the Build Command to `npm run migrate:deploy && npm run build`.

## Authentication

This template is pre-configured with NextAuth for Google authentication, located in the `[...nextauth].ts` file within the `pages/api/auth` directory. Follow these steps to enable Google authentication:

1. Navigate to the [Google Developer Console](https://console.developers.google.com/).
2. Create or select an existing project.
3. Navigate to "Credentials" on the sidebar, create credentials, and select "OAuth client ID".
4. Configure the consent screen, set the application type to "Web application", and provide authorized JavaScript origins and redirect URIs.
5. Obtain your "Client ID" and "Client Secret" and update the `.env` file with these credentials:
    ```env
    # auth credentials
    NEXTAUTH_URL=http://localhost:3000
    GOOGLE_ID=your-google-client-id
    GOOGLE_SECRET=your-google-client-secret
    ```

## Publish-Subscribe System

Explore `src/backend/pubsub.ts` to understand the Publisher and Subscriber interfaces along with the implemented PubSub class. This design enables integration with different Pub/Sub service providers like Google Pub/Sub, RabbitMQ, etc., as your project scales.

## Logging

The `src/backend/logging.ts` file encapsulates structured logging logic and interfaces. This modular design allows for integration with various logging libraries or services as needed.

## Integrations

Integrations with external services or APIs are organized in a modular and isolated manner, allowing for clearer code separation and easier management. Each integration is structured within its own directory under the src/backend/integrations directory. This way, the integrations are kept separate from other backend logic, promoting cleaner and more maintainable code.

## Deployment

Deploy your Next.js app on the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) for a seamless experience. Refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Notes

Monolith, has been primarily crafted for personal use, based on my familiarity and comfort with certain technologies, including but not limited to Next.js, Prisma, and SQLite. While it serves as a structured starting point for building a full-stack monolith application, the choice of technologies and the architecture reflect personal preferences and experiences. As such, while others may find Monolith useful, it is advisable to have a good understanding of the included technologies and frameworks before diving in.

This documentation provides an overview and setup instructions for the Monolith Template. For a deeper understanding, feel free to explore the directory structure and the code.

