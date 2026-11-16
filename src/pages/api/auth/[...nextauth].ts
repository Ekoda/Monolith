import GoogleProvider from "next-auth/providers/google";
import NextAuth, { NextAuthOptions } from "next-auth";
import {handleSignIn} from "@/backend/controllers/authController";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        // ...add more providers here
    ],
    callbacks: {
        async signIn({ user, account }) {
            return handleSignIn(user, account);
        },
    },
};

export default NextAuth(authOptions);
