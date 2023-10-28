import { User as NextAuthUser, Account as NextAuthAccount, Profile as NextAuthProfile } from "next-auth";
import {upsertUser} from "@/backend/services/userService";
import {validatePresent} from "@/utils/errorUtils";
import {logger, withLogging} from "@/backend/logging";

export async function handleSignIn(user: NextAuthUser, account: NextAuthAccount | null, profile: NextAuthProfile | undefined) {
    withLogging(validatePresent, user.email, "No email found in user object")
    upsertUser(user)
        .catch(e => logger.log({
            level: "error",
            message: "Failed to upsert user",
            error: e,
            metadata: {user, account}
        }))
}