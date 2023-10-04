import type { AppProps } from 'next/app'
import {createTheme, ThemeProvider} from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    // Theme customization here
    palette: {
        mode: "dark"
    }

});
export default function App({ Component, pageProps }: AppProps) {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
  )
}
