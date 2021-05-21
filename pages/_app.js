import { useEffect, useContext } from 'react';
// import { useRouter } from "next/router";
import { AuthProvider, AuthContext } from "../lib/Auth";
import HomeComponent from "./index.js";
import '../styles/App.css';

const MyApp = ({ Component, pageProps }) => {
    // const router = useRouter();
    // const userState = useContext(AuthContext);
    // const currentUser = userState.user;
    // console.log(userState)

    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles)
        }
    }, [])

    // let allowed = true;
    // if (router.pathname.startsWith('/admin') && !userState) {
    //     allowed = false
    // }
    
    // const ComponentToRender = allowed ? Component : HomeComponent;
    // const ComponentToRender = HomeComponent;

    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    )
}

export default MyApp;