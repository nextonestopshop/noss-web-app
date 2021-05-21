import React, {useCallback} from "react";
import { useRouter } from 'next/router'
import { auth } from "../../lib/firebase";
import { useAuth } from "../../lib/Auth";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const LoginComponent = (props) => {
    const classes = useStyles();
    const router = useRouter()

    const handleLogin = useCallback(async event => {
        event.preventDefault();
        const { email, password } = event.target.elements;
        try {
            await auth.signInWithEmailAndPassword(email.value, password.value);
            router.push("/admin/products/list");
        } catch (err) {
            console.log(err)
        }
    }, []);

    const { currentUser } = useAuth();

    // if (currentUser) {
    //     return <Redirect to="/admin" />
    // }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                
                <Typography component="h1" variant="h5">Sign in</Typography>
                
                <form className={classes.form} noValidate onSubmit={handleLogin}>
                    <TextField variant="outlined" margin="normal" required fullWidth
                        id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
                        
                    <TextField variant="outlined" margin="normal" required fullWidth
                        name="password" label="Password" type="password" id="password" autoComplete="current-password" />
                        
                    <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                    
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} > Sign In </Button>
                </form>
                
            </div>
        </Container>
    )
}

export const getStaticProps = async () => {
    return {
        props: {}
    }
}

export default LoginComponent;