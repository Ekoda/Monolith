import type { AppProps } from "next/app"
import Head from "next/head";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {SessionProvider} from "next-auth/react";
import SessionWrapper from "@/components/SessionWrapper";
import {getHostInfo} from "@/utils/apiUtils";
import {useMemo} from "react";
import theme from "@/styles/theme";
import {TITLE} from "@/config/constants";

export type System = {
    host: string,
    baseUrl: string,
}

/** Set `MyPage.requireAuth = true` on a page component to make it sign-in only. */
export type PageWithAuth = AppProps["Component"] & { requireAuth?: boolean };

export default function App({ Component, pageProps }: AppProps) {

    const system = {
        ...getHostInfo(process.env.NODE_ENV),
    }
    const props = useMemo(() => {
        return {
            ...pageProps,
            system
        }
    }, [pageProps])

    return (
        <SessionProvider session={pageProps.session}>
            <ThemeProvider theme={theme} defaultMode="light">
                <CssBaseline />
                <Head>
                    <title>{TITLE}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <SessionWrapper requireAuth={(Component as PageWithAuth).requireAuth}>
                    <Component {...props} />
                </SessionWrapper>
            </ThemeProvider>
        </SessionProvider>
    );
}
