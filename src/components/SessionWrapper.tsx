import { useSession } from "next-auth/react";
import LoginBox from "@/components/auth/LoginBox";
import PageLoading from "@/components/PageLoading";
import {ReactNode} from "react";
import Navbar from "@/components/Navbar";

export default function SessionWrapper({ children }: {children: ReactNode}) {
    const { status } = useSession();
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";

    return (
        isLoading ? (
            <PageLoading />
        ) : (
            isAuthenticated ? (
                <div>
                    <Navbar/>
                    {children}
                </div>
            ) : (
                <LoginBox />
            )
        )
    );
}