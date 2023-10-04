import {useState} from "react";
import {Card, CardContent, Button, TextField, Snackbar, Alert} from "@mui/material";
import {Apple, Facebook, Google} from "@mui/icons-material";
import {TITLE} from "@/config/constants";
import {standardLogin, googleLogin, appleLogin, facebookLogin} from "@/config/auth";
;

export default function LoginBox() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);

    return (
        <>
            <Card sx={{textAlign: "center", width: "450px"}} title={"Sign in to " + (TITLE)}>
                <CardContent sx={{display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px"}}>
                    {standardLogin ?
                        <form style={{display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px"}}
                           onSubmit={e => {
                               e.preventDefault();
                               // send login request
                           }}>
                        <TextField required InputLabelProps={{shrink: true}} label="Email" type={"email"} value={email}
                                   onChange={e => setEmail(e.target.value)} variant="outlined" autoComplete={"email"}/>
                        <TextField required InputLabelProps={{shrink: true}} label="Password" variant="outlined"
                                   value={password} onChange={e => setPassword(e.target.value)}
                                   autoComplete={"password"} type={"password"}/>
                        <Button type={"submit"} style={{marginBottom: "10px"}} variant="contained" disabled={isLoading}>Sign in</Button>
                    </form>
                        : null}
                    {googleLogin ? <Button sx={{marginTop: "10px"}} variant="outlined" disabled={isLoading} startIcon={<Google/>}>Sign in with google</Button> : null}
                    {appleLogin ? <Button variant="outlined" disabled={isLoading} startIcon={<Apple/>}>Sign in with apple</Button> : null}
                    {facebookLogin ? <Button variant="outlined" disabled={isLoading} startIcon={<Facebook/>}>Sign in with facebook</Button> : null}
                </CardContent>
            </Card>
            <Snackbar open={showError} autoHideDuration={6000} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }} onClose={e => setShowError(false)} onClick={e => setShowError(false)}>
                <Alert severity="warning" variant={'outlined'} sx={{width: '100%'}}>
                    Oops, something went wrong - try another username or password
                </Alert>
            </Snackbar>
        </>
    );


}