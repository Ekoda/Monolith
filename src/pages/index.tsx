import Head from "next/head";
import { fetchUser, useFetch } from "@/services/apiService";
import { Box, Button, CircularProgress, Container, Typography } from "@mui/material";

export default function Home({ ...props }) {
    const { system } = props;

    const user = useFetch(
        () => fetchUser(system),
        {
            fetchOnMount: false,
            onError: e => console.log(e),
            onReceive: data => console.log(data)
        }
    );

    return (
        <>
            <Head>
                <title>Monolith</title>
                <meta name="description" content="monolith fullstack" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Container>
                <Box mt={5} textAlign="center">
                    <Typography variant="h4" mb={5}>
                        Example
                    </Typography>
                    <Button variant={"contained"} onClick={() => user.trigger()}>
                        Load User
                    </Button>
                    <Box mt={3}>
                        {user.isLoading ? (
                            <CircularProgress />
                        ) : user.error ? (
                            <Typography color="error">{user.error.message}</Typography>
                        ) : (
                            <>
                                <Typography variant="h6">{user.data?.name}</Typography>
                                <Typography variant="h6">{user.data?.email}</Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </Container>
        </>
    );
}