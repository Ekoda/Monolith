import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            quotes: ["warn", "double"],
        },
    },
    globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts", ".sqlite-legacy/**"]),
]);
