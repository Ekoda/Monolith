import { useSession } from "next-auth/react";
import LoginBox from "@/components/auth/LoginBox";
import PageLoading from "@/components/PageLoading";
import {ReactNode} from "react";
import Navbar from "@/components/Navbar";

/**
 * Wraps every page with the navbar. Pages are public by default;
 * a page opts into requiring a signed-in user with `Page.requireAuth = true`.
 */
export default function SessionWrapper({ children, requireAuth = false }: { children: ReactNode, requireAuth?: boolean }) {
    const { status } = useSession();

    if (requireAuth && status === "loading") return <PageLoading />;

    return (
        <>
            <Navbar />
            {requireAuth && status !== "authenticated" ? <LoginBox /> : children}
        </>
    );
}
