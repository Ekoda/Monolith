import * as React from "react";
import NextLink from "next/link";
import {useRouter} from "next/router";
import {
    AppBar, Avatar, Backdrop, Box, Button, CircularProgress, Container, Divider,
    IconButton, ListItemIcon, Menu, MenuItem, Skeleton, Stack, Toolbar, Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginOutlined from "@mui/icons-material/LoginOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import {signOut, useSession} from "next-auth/react";
import Logo from "@/components/Logo";
import ColorModeToggle from "@/components/ColorModeToggle";

const pages = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" }
];

const Navbar = () => {
    const router = useRouter();
    const [logoutTriggered, setLogoutTriggered] = React.useState(false);
    const authSession = useSession();
    const user = authSession.data?.user;
    const isSignedIn = authSession.status === "authenticated";

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleLogout = () => {
        setAnchorElUser(null);
        setLogoutTriggered(true);
        signOut().finally(() => setLogoutTriggered(false));
    };

    const isActive = (path: string) => router.pathname === path;

    return (
        <>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={logoutTriggered}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AppBar component="nav" position="sticky">
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ gap: 1, minHeight: { xs: 60 } }}>
                        {/* Mobile menu */}
                        <Box sx={{ display: { xs: "flex", md: "none" } }}>
                            <IconButton
                                size="small"
                                aria-label="Open navigation"
                                aria-controls="nav-menu"
                                aria-haspopup="true"
                                onClick={(e) => setAnchorElNav(e.currentTarget)}
                                sx={{ color: "text.secondary" }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="nav-menu"
                                anchorEl={anchorElNav}
                                open={Boolean(anchorElNav)}
                                onClose={() => setAnchorElNav(null)}
                                slotProps={{ paper: { sx: { minWidth: 180 } } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem
                                        key={page.name}
                                        component={NextLink}
                                        href={page.path}
                                        selected={isActive(page.path)}
                                        onClick={() => setAnchorElNav(null)}
                                    >
                                        {page.name}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <Box component={NextLink} href="/" sx={{ textDecoration: "none", color: "text.primary", mr: 3 }}>
                            <Logo />
                        </Box>

                        {/* Desktop links */}
                        <Stack direction="row" spacing={0.5} sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                            {pages.map((page) => (
                                <Button
                                    key={page.name}
                                    component={NextLink}
                                    href={page.path}
                                    size="small"
                                    color="inherit"
                                    sx={{
                                        px: 1.5,
                                        color: isActive(page.path) ? "text.primary" : "text.secondary",
                                        bgcolor: isActive(page.path) ? "action.selected" : "transparent",
                                        "&:hover": { color: "text.primary", bgcolor: "action.hover" },
                                    }}
                                >
                                    {page.name}
                                </Button>
                            ))}
                        </Stack>
                        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} />

                        <ColorModeToggle />

                        <IconButton
                            onClick={(e) => setAnchorElUser(e.currentTarget)}
                            aria-label="Account menu"
                            sx={{ p: 0.5, borderRadius: "50%" }}
                        >
                            {authSession.status === "loading" ? (
                                <Skeleton variant="circular" width={32} height={32} />
                            ) : (
                                <Avatar alt={user?.name ?? "Guest"} src={user?.image ?? undefined} sx={{ width: 32, height: 32 }} />
                            )}
                        </IconButton>
                        <Menu
                            id="account-menu"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            open={Boolean(anchorElUser)}
                            onClose={() => setAnchorElUser(null)}
                            slotProps={{ paper: { sx: { minWidth: 220 } } }}
                        >
                            <Box sx={{ px: 1.5, py: 1, maxWidth: 260 }}>
                                <Typography variant="subtitle2" noWrap>
                                    {isSignedIn ? (user?.name ?? "Signed in") : "You're browsing as a guest"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap={isSignedIn}>
                                    {isSignedIn ? user?.email : "Sign in to access your account."}
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 0.5 }} />
                            {isSignedIn ? (
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon><LogoutOutlined fontSize="small" /></ListItemIcon>
                                    Sign out
                                </MenuItem>
                            ) : (
                                <MenuItem
                                    component={NextLink}
                                    href={router.pathname === "/login" ? "/login" : `/login?callbackUrl=${encodeURIComponent(router.asPath)}`}
                                    onClick={() => setAnchorElUser(null)}
                                >
                                    <ListItemIcon><LoginOutlined fontSize="small" /></ListItemIcon>
                                    Sign in
                                </MenuItem>
                            )}
                        </Menu>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};

export default Navbar;
