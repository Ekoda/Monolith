import {Box, CircularProgress} from "@mui/material";

export default function PageLoading() {
    return (
        <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
            <CircularProgress size={28} thickness={5} />
        </Box>
    )
}
