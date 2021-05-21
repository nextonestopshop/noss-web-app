import React, { useState, useContext } from "react";
import { auth } from '../../lib/firebase'
import { useRouter } from 'next/router';
import { useAuth } from "../../lib/Auth";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import MoreIcon from '@material-ui/icons/MoreVert';
import { fade, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    grow: {
        flexGrow: 1,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    companyLogo: {
        cursor: 'pointer',
        height: '40px',
        [theme.breakpoints.up('md')]: {
            height: '64px'
        }
    },
    logoImage: {
        height: '100%'
    },
    currentUser: {
        padding: '15px'
    },
    search: {
        display: 'none',
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));

const Header = () => {
    const classes = useStyles();
    const router = useRouter();
    const { currentUser } = useAuth();

    const handleProfileMenuOpen = (event) => {
        // setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuOpen = (event) => {
        // setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleSignOut = () => {
        auth.signOut().then(res => {
            console.log(res)
            router.push("/login");
        })
    }

    return (
        <div className={classes.grow}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <div className={classes.companyLogo} onClick={() => router.push('/')}>
                        <img className={classes.logoImage} src={'/images/noss-logo.png'} alt="NOSS Logo" />
                    </div>
                    <div className={classes.grow} />
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                        <SearchIcon />
                        </div>
                        <InputBase
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    <div className={classes.grow} />
                    {
                        currentUser ? (
                            <div className={classes.sectionDesktop}>
                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                <AccountCircle />
                                </IconButton>
                                <Typography className={`${classes.title} ${classes.currentUser}`} variant="body2" noWrap>
                                    Hi, Admin
                                </Typography>
                                <IconButton
                                    edge="end"
                                    aria-label="logout user"
                                    aria-haspopup="true"
                                    onClick={handleSignOut}
                                    color="inherit"
                                >
                                <PowerSettingsNewIcon />
                                </IconButton>
                            </div>
                        ) : null
                    }
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header;