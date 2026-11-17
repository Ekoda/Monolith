import { Html, Head, Main, NextScript } from "next/document"
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <InitColorSchemeScript attribute="data" defaultMode="light" />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
