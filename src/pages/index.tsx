import NextLink from "next/link";
import { fetchUser, useFetch } from "@/services/apiService";
import { useSession } from "next-auth/react";
import {
    Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Grid, Stack, Typography
} from "@mui/material";
import StorageOutlined from "@mui/icons-material/StorageOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import ApiOutlined from "@mui/icons-material/ApiOutlined";
import HubOutlined from "@mui/icons-material/HubOutlined";
import PaletteOutlined from "@mui/icons-material/PaletteOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import { TITLE } from "@/config/constants";

const stack = ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "MUI"];

const features = [
    { icon: <StorageOutlined />, title: "Database", body: "PostgreSQL + Prisma with migrations and a typed client. Docker for local dev, any hosted Postgres in prod." },
    { icon: <LockOutlined />, title: "Authentication", body: "NextAuth with OAuth providers. Pages are public by default; set Page.requireAuth = true to protect one." },
    { icon: <ApiOutlined />, title: "API routes", body: "Typed endpoints under pages/api, with withAuth to guard them and a useFetch hook on the client." },
    { icon: <HubOutlined />, title: "Pub/Sub & integrations", body: "A lightweight publish-subscribe system and a pattern for wrapping third-party APIs." },
    { icon: <ReceiptLongOutlined />, title: "Logging", body: "Structured backend logging that is ready to point at your provider of choice." },
    { icon: <PaletteOutlined />, title: "Themeable UI", body: "Design tokens in src/styles/theme.ts. Change a colour, radius or font and the whole app follows." },
];

export default function Home({ ...props }) {
    const { system } = props;
    const { data: session, status } = useSession();
    const isSignedIn = status === "authenticated";
    const firstName = session?.user?.name?.split(" ")[0];

    const user = useFetch(
        () => fetchUser(system),
        {
            fetchOnMount: false,
            onError: e => console.log(e),
            onReceive: data => console.log(data)
        }
    );

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 12 } }}>
            {/* Hero */}
            <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center", maxWidth: 760, mx: "auto", mb: { xs: 8, md: 12 } }}>
                <Chip
                    label={isSignedIn && firstName ? `Welcome back, ${firstName}` : "Full-stack starter template"}
                    size="small" color="primary" variant="outlined"
                />
                <Typography variant="h2" component="h1" sx={{ fontSize: { xs: "2.5rem", md: "3.75rem" } }}>
                    Ship your idea as one{" "}
                    <Box component="span" sx={{ color: "primary.main" }}>{TITLE.toLowerCase()}</Box>
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: { xs: "1.05rem", md: "1.2rem" }, maxWidth: 600 }}>
                    Frontend, backend and database in a single repository. Everything you need to go from
                    idea to deployed app, without stitching services together.
                </Typography>
                <Stack direction="row" spacing={1.5}>
                    <Button variant="contained" size="large" href="#features">Explore features</Button>
                    <Button variant="outlined" color="inherit" size="large" component={NextLink} href="/about">About</Button>
                </Stack>
                <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1, pt: 1 }}>
                    {stack.map(s => (
                        <Chip key={s} label={s} size="small" sx={{ bgcolor: "action.hover", color: "text.secondary" }} />
                    ))}
                </Stack>
            </Stack>

            {/* Features */}
            <Box id="features" sx={{ scrollMarginTop: 80 }}>
                <Typography variant="overline" sx={{ color: "primary.main" }}>What&apos;s included</Typography>
                <Typography variant="h4" component="h2" sx={{ mb: 4 }}>Batteries included, nothing locked in</Typography>
                <Grid container spacing={2.5}>
                    {features.map(f => (
                        <Grid key={f.title} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card sx={{ height: "100%" }}>
                                <CardContent>
                                    <Box sx={{
                                        width: 36, height: 36, mb: 2, borderRadius: 1, display: "grid", placeItems: "center",
                                        color: "primary.main", bgcolor: "action.hover", "& svg": { fontSize: 20 }
                                    }}>
                                        {f.icon}
                                    </Box>
                                    <Typography variant="subtitle2" gutterBottom>{f.title}</Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>{f.body}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Live example */}
            <Card sx={{ mt: { xs: 8, md: 12 } }}>
                <CardContent sx={{ p: { xs: 3, md: 5 }, "&:last-child": { pb: { xs: 3, md: 5 } } }}>
                    <Grid container spacing={4} sx={{ alignItems: "center" }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="overline" sx={{ color: "primary.main" }}>Try it</Typography>
                            <Typography variant="h5" component="h2" gutterBottom>Authenticated API call</Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                Calls <code>/api/users/current</code>, a route guarded by <code>withAuth</code>,
                                through the typed <code>useFetch</code> hook. Sign in to see it return your user from the database.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{
                                minHeight: 72, mb: 2, px: 2, py: 1.5, display: "flex", alignItems: "center",
                                borderRadius: 1, bgcolor: "action.hover"
                            }}>
                                {user.isLoading ? (
                                    <CircularProgress size={22} />
                                ) : user.error ? (
                                    <Typography variant="body2" color="error">{user.error.message}</Typography>
                                ) : user.data ? (
                                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
                                        <Avatar sx={{ width: 36, height: 36 }} />
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="subtitle2" noWrap>{user.data.name}</Typography>
                                            <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>{user.data.email}</Typography>
                                        </Box>
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        {isSignedIn ? "No data loaded yet." : "You're not signed in."}
                                    </Typography>
                                )}
                            </Box>
                            {isSignedIn ? (
                                <Button variant="contained" onClick={() => user.trigger()} disabled={user.isLoading}>
                                    Load user
                                </Button>
                            ) : (
                                <Button variant="contained" component={NextLink} href="/login" disabled={status === "loading"}>
                                    Sign in to try
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}
