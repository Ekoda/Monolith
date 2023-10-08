import { User as NextAuthUser, Account as NextAuthAccount, Profile as NextAuthProfile } from "next-auth";
import {createUser, findUserByEmail, updateUser} from "@/backend/services/userService";
import {validatePresent} from "@/utils/errorUtils";
import {withLogging} from "@/backend/logging";
import {getCurrentTime} from "@/utils/timeUtils";

export async function handleSignIn(user: NextAuthUser, account: NextAuthAccount | null, profile: NextAuthProfile | undefined) {
    withLogging(validatePresent, user.email, "No email found in user object")
    const dbUser = await findUserByEmail(user.email as string)

    if(dbUser) {
        await updateUser(user.email as string, {lastLogin: getCurrentTime()})
    } else {
        await createUser(user)
    }

}