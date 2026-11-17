import {methodNotAllowed405, notFound404, ok200} from "@/utils/apiUtils";
import {findUserByEmail} from "@/backend/services/userService";
import {withAuth} from "@/backend/auth/withAuth";


export default withAuth(async (req, res, {user}) => {
    if (req.method !== "GET") {
        return methodNotAllowed405(res);
    }

    const dbUser = await findUserByEmail(user.email);
    if (!dbUser) {
        return notFound404(res);
    }
    return ok200(res, dbUser);
});
