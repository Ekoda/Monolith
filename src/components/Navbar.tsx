import * as React from 'react';
import {
    AppBar, Avatar, Backdrop, Box, Button, CircularProgress, Container,
    IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography
} from '@mui/material';
import {signOut, useSession} from 'next-auth/react';
import {TITLE} from "@/config/constants";

const pages = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" }
];

const Navbar = () => {
    const [logoutTriggered, setLogoutTriggered] = React.useState(false);
    const authSession = useSession();
    const userImage = authSession.data?.user?.image;
    const userName = authSession.data?.user?.name;

    const settings = [
        {
            key: 'Logout',
            onClick: () => {
                setLogoutTriggered(true);
                signOut().then(r => setLogoutTriggered(false));
            }
        }
    ];

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={logoutTriggered}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AppBar component={'nav'} variant={"outlined"} elevation={0} sx={{backgroundColor: "transparent", position: "static"}}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'Verdana',
                                fontWeight: 200,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            {TITLE}
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                    key={page.name}
                                    href={page.path}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page.name}
                                </Button>
                            ))}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="You" src={userImage as string} sx={{ width: 50, height: 50 }} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting.key} onClick={setting.onClick}>
                                        <Typography textAlign="center">{setting.key}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};

export default Navbar;