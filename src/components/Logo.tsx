import {Box, Typography} from "@mui/material";
import {TITLE} from "@/config/constants";

/** App mark + name. Replace the mark with your own SVG to rebrand. */
export default function Logo({ showText = true, size = 28 }: { showText?: boolean, size?: number }) {
    return (
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.25 }}>
            <Box
                aria-hidden
                sx={(theme) => ({
                    width: size,
                    height: size,
                    borderRadius: `${size * 0.3}px`,
                    display: "grid",
                    placeItems: "center",
                    color: (theme.vars ?? theme).palette.primary.contrastText,
                    fontWeight: 700,
                    fontSize: size * 0.5,
                    background: `linear-gradient(135deg, ${(theme.vars ?? theme).palette.primary.light}, ${(theme.vars ?? theme).palette.primary.dark})`,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
                })}
            >
                {TITLE.charAt(0)}
            </Box>
            {showText && (
                <Typography component="span" sx={{ fontWeight: 600, fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
                    {TITLE}
                </Typography>
            )}
        </Box>
    );
}
