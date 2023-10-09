# Monolith Template
<!--LLM-->
This template provides a structured starting point for building a full-stack monolith application using Next.js, Prisma, and SQLite. It includes an organized backend, a Prisma db schema, and API endpoints structured under the pages directory. Initially configured with SQLite for ease of development, it allows for a smooth transition to more robust databases like PostgreSQL as your project scales.
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

1. Ensure your `.env` file has the `DATABASE_URL` variable set to `file:./dev.db` for SQLite or to a PostgreSQL database URL for a more robust setup.

2. Create an initial migration to set up the database schema:
    ```bash
    npx prisma migrate dev --name init
    ```

3. Apply the migration, which generates the necessary tables and the Prisma Client based on your schema:
   ```
   npm run migrate 
   ```

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
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
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

