import { Container, Stack, Typography } from "@mui/material";
import { TITLE } from "@/config/constants";

export default function About() {
    return (
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
            <Stack spacing={2} sx={{ maxWidth: 640 }}>
                <Typography variant="overline" color="primary">About</Typography>
                <Typography variant="h3" component="h1">About {TITLE}</Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.1rem" }}>
                    A full-stack starting point built on Next.js, MUI, NextAuth and Prisma.
                    Replace this page with whatever your product needs.
                </Typography>
            </Stack>
        </Container>
    )
}
