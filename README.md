<!--LLM-->
## Monolith Template
This template is designed to provide a starting point for building a full-stack monolith using Next.js, Prisma, and SQLite. It includes a structured backend with controllers, a database folder with a Prisma schema, and endpoints under the pages directory. The template is configured to use SQLite for ease of development, with the option to transition to a more robust database like PostgreSQL as the project scales.
<!--LLM-->

## Getting Started

Install any dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Setting up the database

Ensure that the .env file has the DATABASE_URL variable set to file:./dev.db for SQLite. Or set it to a PostgreSQL database URL with additional information.

Create an initial migration to set up the database schema: `npx prisma migrate dev --name init`

Prisma will prompt you to apply the migration. This will create the `./dev.db` file (if it doesn't already exist), generate the necessary tables, and also generate the Prisma Client based on your schema.

## Auth

NextAuth has already been set up to facilitate OAuth authentication. The configuration is located in the `[...nextauth].ts` file within the `pages/api/auth directory`. Currently, it is configured for Google authentication, but you can easily extend it to other providers as well.

When a user is signed in for the first time a new account is created in the database. And when an existing user signs in their details are updated.

To enable Google authentication, you just need to create and configure a project on the Google Developer Console and obtain your OAuth 2.0 credentials (Client ID and Client Secret). Follow the steps provided in the previous section to configure Google authentication.

Create a Google OAuth 2.0 Client ID and Secret:

1. Go to the Google Developer Console.
2. Create a new project, or select an existing one.
3. Navigate to "Credentials" on the sidebar.
4. Click on "Create credentials" and select "OAuth client ID".
5. Configure the consent screen and provide the necessary information.
6. For the application type, select "Web application".
7. Set the authorized JavaScript origins and redirect URIs (for local testing, use http://localhost:3000).
8. After creation, you'll be provided with a "Client ID" and "Client Secret".
9. Set up the following variables in the `.env` file
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Pub/Sub

This template is designed with extensibility in mind, allowing for the integration of a Publish-Subscribe (Pub/Sub) messaging system for handling asynchronous events. A Pub/Sub system can facilitate the decoupling of event producers and consumers, thereby promoting scalable and maintainable code structures.

The `src/backend/pubsub.ts` file houses the Publisher and Subscriber interfaces along with a PubSub class that implements both interfaces. These interfaces are modeled to be flexible, enabling you to plug in different Pub/Sub service providers like Google Pub/Sub, RabbitMQ, etc., as your project scales.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
