# Monolith Template

This template provides a structured starting point for building a full-stack monolith application using Next.js, Prisma, and SQLite. It encapsulates a well-organized backend, a Prisma schema within a database folder, and API endpoints structured under the pages directory. Initially configured with SQLite for ease of development, it allows for a smooth transition to more robust databases like PostgreSQL as your project scales.

## Table of Contents

- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Authentication](#authentication)
- [Publish-Subscribe System](#publish-subscribe-system)
- [Logging](#logging)
- [Deployment](#deployment)
- [Notes](#notes)

## Getting Started

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

1. Ensure your `.env` file has the `DATABASE_URL` variable set to `file:./dev.db` for SQLite or to a PostgreSQL database URL for a more robust setup.

2. Create an initial migration to set up the database schema:
    ```bash
    npx prisma migrate dev --name init
    ```

3. Apply the migration, which generates the necessary tables and the Prisma Client based on your schema.

## Authentication

This template is pre-configured with NextAuth for Google authentication, located in the `[...nextauth].ts` file within the `pages/api/auth` directory. Follow these steps to enable Google authentication:

1. Navigate to the [Google Developer Console](https://console.developers.google.com/).
2. Create or select an existing project.
3. Navigate to "Credentials" on the sidebar, create credentials, and select "OAuth client ID".
4. Configure the consent screen, set the application type to "Web application", and provide authorized JavaScript origins and redirect URIs.
5. Obtain your "Client ID" and "Client Secret" and update the `.env` file with these credentials:
    ```env
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    ```

## Publish-Subscribe System

Explore `src/backend/pubsub.ts` to understand the Publisher and Subscriber interfaces along with the implemented PubSub class. This design enables integration with different Pub/Sub service providers like Google Pub/Sub, RabbitMQ, etc., as your project scales.

## Logging

The `src/backend/logging.ts` file encapsulates structured logging logic and interfaces. This modular design allows for integration with various logging libraries or services as needed.

## Deployment

Deploy your Next.js app on the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) for a seamless experience. Refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Notes
This documentation provides an overview and setup instructions for the Monolith Template. For a deeper understanding, feel free to explore the directory structure and the code.
