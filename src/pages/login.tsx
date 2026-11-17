import {useEffect} from "react";
import Head from "next/head";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import LoginBox from "@/components/auth/LoginBox";
import PageLoading from "@/components/PageLoading";
import {TITLE} from "@/config/constants";

export default function Login() {
    const router = useRouter();
    const { status } = useSession();

    // Already signed in? Send them on.
    useEffect(() => {
        if (status === "authenticated") {
            const callbackUrl = typeof router.query.callbackUrl === "string" ? router.query.callbackUrl : "/";
            router.replace(callbackUrl);
        }
    }, [status, router]);

    return (
        <>
            <Head><title>{`Sign in · ${TITLE}`}</title></Head>
            {status === "unauthenticated" ? <LoginBox /> : <PageLoading />}
        </>
    );
}
