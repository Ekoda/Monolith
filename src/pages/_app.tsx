import type { AppProps } from "next/app"
import {createTheme, ThemeProvider} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import {SessionProvider} from "next-auth/react";
import SessionWrapper from "@/components/SessionWrapper";
import {getHostInfo} from "@/utils/apiUtils";
import {useMemo} from "react";

const theme = createTheme({
    // Theme customization here
    palette: {
        mode: "dark"
    }

});

export type System = {
    host: string,
    baseUrl: string,
}

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
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SessionWrapper>
                    <Component {...props} />
                </SessionWrapper>
            </ThemeProvider>
        </SessionProvider>
    );
}
