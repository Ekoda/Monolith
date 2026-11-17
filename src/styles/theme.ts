import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

/**
 * Design tokens.
 * These few values drive the whole look of the app — change them to re-skin it.
 */
export const tokens = {
    /** Main accent colour (buttons, links, focus rings). */
    brand: { light: "#4F46E5", dark: "#818CF8" },
    /** Base corner radius in px. Cards use 1.5x, chips/inputs use 1x. */
    radius: 10,
    fontFamily: `${inter.style.fontFamily}, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
    /** Neutral scale (zinc). Swap for slate/stone/etc. to change the temperature of the UI. */
    neutral: {
        50: "#FAFAFA",
        100: "#F4F4F5",
        200: "#E4E4E7",
        300: "#D4D4D8",
        400: "#A1A1AA",
        500: "#71717A",
        600: "#52525B",
        700: "#3F3F46",
        800: "#27272A",
        900: "#18181B",
        950: "#09090B",
    },
};

const n = tokens.neutral;

const theme = createTheme({
    cssVariables: { colorSchemeSelector: "data" },
    defaultColorScheme: "light",
    colorSchemes: {
        light: {
            palette: {
                primary: { main: tokens.brand.light },
                grey: n,
                text: { primary: n[900], secondary: n[600], disabled: n[400] },
                background: { default: n[50], paper: "#FFFFFF" },
                divider: n[200],
            },
        },
        dark: {
            palette: {
                primary: { main: tokens.brand.dark },
                grey: n,
                text: { primary: n[50], secondary: n[400], disabled: n[600] },
                background: { default: n[950], paper: n[900] },
                divider: n[800],
            },
        },
    },
    shape: { borderRadius: tokens.radius },
    typography: {
        fontFamily: tokens.fontFamily,
        h1: { fontWeight: 700, letterSpacing: "-0.035em" },
        h2: { fontWeight: 700, letterSpacing: "-0.03em" },
        h3: { fontWeight: 700, letterSpacing: "-0.025em" },
        h4: { fontWeight: 600, letterSpacing: "-0.02em" },
        h5: { fontWeight: 600, letterSpacing: "-0.015em" },
        h6: { fontWeight: 600, letterSpacing: "-0.01em" },
        subtitle1: { fontWeight: 500 },
        subtitle2: { fontWeight: 600 },
        overline: { fontWeight: 600, letterSpacing: "0.08em" },
        button: { textTransform: "none", fontWeight: 500, letterSpacing: 0 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: (theme) => ({
                body: {
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                },
                "::selection": {
                    background: `color-mix(in srgb, ${theme.vars.palette.primary.main} 22%, transparent)`,
                },
                a: { color: "inherit" },
                code: {
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                    fontSize: "0.85em",
                    padding: "0.15em 0.4em",
                    borderRadius: 6,
                    backgroundColor: theme.vars.palette.action.hover,
                },
            }),
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: tokens.radius, paddingInline: 16 },
                sizeLarge: { paddingBlock: 10, fontSize: "0.95rem" },
            },
            variants: [
                {
                    props: { variant: "outlined", color: "inherit" },
                    style: ({ theme }) => ({
                        borderColor: theme.vars.palette.divider,
                        backgroundColor: theme.vars.palette.background.paper,
                        "&:hover": {
                            borderColor: theme.vars.palette.grey[300],
                            backgroundColor: theme.vars.palette.action.hover,
                            ...theme.applyStyles("dark", { borderColor: theme.vars.palette.grey[700] }),
                        },
                    }),
                },
            ],
        },
        MuiIconButton: {
            styleOverrides: { root: { borderRadius: tokens.radius } },
        },
        MuiPaper: {
            styleOverrides: { root: { backgroundImage: "none" } },
        },
        MuiCard: {
            defaultProps: { variant: "outlined" },
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: tokens.radius * 1.5,
                    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
                    ...theme.applyStyles("dark", { boxShadow: "none" }),
                }),
            },
        },
        MuiCardContent: {
            styleOverrides: { root: { padding: 24, "&:last-child": { paddingBottom: 24 } } },
        },
        MuiAppBar: {
            defaultProps: { elevation: 0, color: "inherit" },
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.default} 80%, transparent)`,
                    backdropFilter: "saturate(180%) blur(12px)",
                    borderBottom: `1px solid ${theme.vars.palette.divider}`,
                }),
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: tokens.radius,
                    backgroundColor: theme.vars.palette.background.paper,
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.vars.palette.divider },
                    "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.vars.palette.text.disabled,
                    },
                }),
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    marginTop: 6,
                    border: `1px solid ${theme.vars.palette.divider}`,
                    boxShadow: "0 12px 32px -8px rgba(16, 24, 40, 0.14), 0 2px 6px rgba(16, 24, 40, 0.05)",
                    ...theme.applyStyles("dark", { boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.6)" }),
                }),
            },
        },
        MuiMenu: {
            styleOverrides: { list: { padding: 6 } },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: { borderRadius: tokens.radius * 0.6, fontSize: "0.875rem", minHeight: 36 },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: ({ theme }) => ({
                    backgroundColor: theme.vars.palette.grey[900],
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    padding: "6px 10px",
                    borderRadius: tokens.radius * 0.6,
                    ...theme.applyStyles("dark", {
                        backgroundColor: theme.vars.palette.grey[100],
                        color: theme.vars.palette.grey[900],
                    }),
                }),
            },
        },
        MuiChip: {
            styleOverrides: { root: { fontWeight: 500 } },
        },
        MuiDivider: {
            styleOverrides: {
                withChildren: ({ theme }) => ({
                    fontSize: "0.75rem",
                    color: theme.vars.palette.text.secondary,
                    "&::before, &::after": { borderColor: theme.vars.palette.divider },
                }),
            },
        },
        MuiAlert: {
            styleOverrides: { root: { borderRadius: tokens.radius } },
        },
        MuiLink: {
            defaultProps: { underline: "hover" },
        },
    },
});

export default theme;
