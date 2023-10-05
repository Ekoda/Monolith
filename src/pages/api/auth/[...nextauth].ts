import GoogleProvider from "next-auth/providers/google";
import NextAuth, { NextAuthOptions, User, Account, Profile } from "next-auth";
import {handleSignIn} from "@/backend/controllers/authController";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        // ...add more providers here
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) {
                console.log("No email found in user object");
                return false;
            }
            await handleSignIn(user, account, profile);
            return true;
        },
    },
};

export default NextAuth(authOptions);
