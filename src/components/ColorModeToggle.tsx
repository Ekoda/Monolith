import {IconButton, Tooltip} from "@mui/material";
import {useColorScheme} from "@mui/material/styles";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";

export default function ColorModeToggle() {
    const { mode, systemMode, setMode } = useColorScheme();
    if (!mode) return null; // not resolved yet on first render

    const resolved = mode === "system" ? systemMode : mode;
    const next = resolved === "dark" ? "light" : "dark";

    return (
        <Tooltip title={`Switch to ${next} mode`}>
            <IconButton size="small" onClick={() => setMode(next)} sx={{ color: "text.secondary" }}>
                {resolved === "dark" ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
            </IconButton>
        </Tooltip>
    );
}
