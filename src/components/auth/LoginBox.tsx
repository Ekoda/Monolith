import {useState} from "react";
import {Alert, Box, Button, Card, CardContent, Divider, Snackbar, Stack, TextField, Typography} from "@mui/material";
import {Apple, Facebook, Google} from "@mui/icons-material";
import {TITLE} from "@/config/constants";
import {standardLogin, googleLogin, appleLogin, facebookLogin} from "@/config/auth";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import Logo from "@/components/Logo";

export default function LoginBox() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);

    const router = useRouter();
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    if (session) return null;

    // After signing in, return to where the user came from (or home when on /login itself).
    const queryCallback = typeof router.query.callbackUrl === "string" ? router.query.callbackUrl : undefined;
    const callbackUrl = queryCallback ?? (router.pathname === "/login" ? "/" : router.asPath);

    const socialLogins = [
        { enabled: googleLogin, provider: "google", label: "Continue with Google", icon: <Google /> },
        { enabled: appleLogin, provider: "apple", label: "Continue with Apple", icon: <Apple /> },
        { enabled: facebookLogin, provider: "facebook", label: "Continue with Facebook", icon: <Facebook /> },
    ].filter(l => l.enabled);

    return (
        <Box
            component="main"
            sx={(theme) => ({
                minHeight: "calc(100vh - 61px)",
                display: "grid",
                placeItems: "center",
                px: 2,
                backgroundImage: `radial-gradient(60rem 30rem at 50% -10%, color-mix(in srgb, ${(theme.vars ?? theme).palette.primary.main} 10%, transparent), transparent)`,
            })}
        >
            <Box sx={{ width: "100%", maxWidth: 400 }}>
                <Card>
                    <CardContent sx={{ p: { xs: 3, sm: 4 }, "&:last-child": { pb: { xs: 3, sm: 4 } } }}>
                        <Stack spacing={1} sx={{ alignItems: "center", textAlign: "center", mb: 3 }}>
                            <Logo showText={false} size={40} />
                            <Typography variant="h5" component="h1" sx={{ pt: 1 }}>
                                Sign in to {TITLE}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                Welcome back! Please sign in to continue.
                            </Typography>
                        </Stack>

                        <Stack spacing={1.5}>
                            {socialLogins.map(l => (
                                <Button
                                    key={l.provider}
                                    onClick={() => signIn(l.provider, { callbackUrl })}
                                    variant="outlined"
                                    color="inherit"
                                    size="large"
                                    fullWidth
                                    disabled={isLoading}
                                    startIcon={l.icon}
                                >
                                    {l.label}
                                </Button>
                            ))}

                            {standardLogin && socialLogins.length > 0 && <Divider sx={{ py: 1 }}>or</Divider>}

                            {standardLogin && (
                                <Stack
                                    component="form"
                                    spacing={2}
                                    onSubmit={e => {
                                        e.preventDefault();
                                        // send login request
                                    }}
                                >
                                    <TextField required label="Email" type="email" value={email}
                                               onChange={e => setEmail(e.target.value)} autoComplete="email" fullWidth />
                                    <TextField required label="Password" type="password" value={password}
                                               onChange={e => setPassword(e.target.value)} autoComplete="current-password" fullWidth />
                                    <Button type="submit" variant="contained" size="large" disabled={isLoading} fullWidth>
                                        Sign in
                                    </Button>
                                </Stack>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
                <Typography variant="caption" component="p" sx={{ color: "text.secondary", textAlign: "center", mt: 3 }}>
                    By continuing you agree to our Terms and Privacy Policy.
                </Typography>
            </Box>

            <Snackbar open={showError} autoHideDuration={6000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                      onClose={() => setShowError(false)} onClick={() => setShowError(false)}>
                <Alert severity="warning" variant="outlined" sx={{ width: "100%", bgcolor: "background.paper" }}>
                    Oops, something went wrong - try another username or password
                </Alert>
            </Snackbar>
        </Box>
    );
}
