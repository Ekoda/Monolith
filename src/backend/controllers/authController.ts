import { User as NextAuthUser, Account as NextAuthAccount } from "next-auth";
import {upsertUser} from "@/backend/services/userService";
import {logger} from "@/backend/logging";


export async function handleSignIn(user: NextAuthUser, account: NextAuthAccount | null): Promise<boolean> {
    if (!user.email) {
        await logger.log({level: "warn", message: "Sign-in rejected: no email on user", metadata: {provider: account?.provider}});
        return false;
    }

    try {
        await upsertUser(user.email, user.name);
        return true;
    } catch (e) {
        await logger.log({
            level: "error",
            message: "Failed to upsert user on sign-in",
            error: e as Error,
            metadata: {provider: account?.provider}
        });
        return false;
    }
}
