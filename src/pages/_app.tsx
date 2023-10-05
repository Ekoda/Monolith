import type { AppProps } from 'next/app'
import {createTheme, ThemeProvider} from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import {SessionProvider} from "next-auth/react";
import SessionWrapper from "@/components/SessionWrapper";

const theme = createTheme({
    // Theme customization here
    palette: {
        mode: "dark"
    }

});
export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SessionWrapper>
                    <Component {...pageProps} />
                </SessionWrapper>
            </ThemeProvider>
        </SessionProvider>
    );
}
