import { useRouter } from 'next/router'
import Head from 'next/head'
import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { firestore } from "../../lib/firebase";
import { generatePath } from "../../lib/utils";

import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Header from "../../components/header";
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from 'next/link';
// import placeholder from '../../src/assets/images/placeholder.png';

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: '15px',
        marginBottom: '16px',
        fontSize: '1.5rem',
        fontWeight: '400',
        lineHeight: '1.334',
        letterSpacing: '0em'
    },
    ratingText: {
        marginLeft: '10px',
        verticalAlign: '5px'
    },
    ratingWrapper: {
        textAlign: "right"
    },
    productImage: {
        maxWidth: '100%'
    },
    buttonWrapper: {
        textAlign: 'right',
        margin: '40px 0 20px'
    }
}));

const ProductDetail = ({ productDetails }) => {
    const router = useRouter()
    const classes = useStyles();

    const handleCheckout = () => {
        window.open(productDetails.productUrl, "_blank")
    }

    console.log(productDetails)
    return (
        <div>
            <Head>
                <title key="title">{`${productDetails.title}, ${productDetails.category.categoryName} | NOSS`}</title>
                <meta key="description" name="description" content={`${productDetails.description} Check this and more other amazing ${productDetails.category.categoryName} on Next One Stop Shop`} />
                <meta property="og:title" content={`${productDetails.title}, ${productDetails.category.categoryName} | NOSS`} />
                <meta property="og:description" content={`${productDetails.description} Check this and more other amazing ${productDetails.category.categoryName} on Next One Stop Shop`} />
                <meta property="og:image" content={productDetails.imageUrl.url} />
            </Head>
            <Header />
            <Toolbar />
                {
                    productDetails && (
                        <>
                            <Toolbar variant='dense' />
                            <Container maxWidth="lg" className={classes.root}>
                                <Breadcrumbs separator="›" aria-label="breadcrumb">
                                    <Link color="inherit" href="/">
                                        Home
                                    </Link>
                                    <Link color="inherit" href={`/category/${generatePath(productDetails.category.categoryName)}`}>
                                        {productDetails.category.categoryName}
                                    </Link>
                                    <Link color="inherit" href={`/category/${generatePath(productDetails.category.categoryName)}/${generatePath(productDetails.category.subCategoryName)}`}>
                                        {productDetails.category.subCategoryName}
                                    </Link>
                                </Breadcrumbs>
                            </Container>
                                
                            <Container maxWidth="md" className={classes.root}>
                                <div className="home-wrapper">
                                    <Toolbar />
                                    <Grid container spacing={6}>
                                        <Grid item xs={12} md={6} lg={5}>
                                            <img className={classes.productImage} src={productDetails.imageUrl ? productDetails.imageUrl.url : ''}
                                                alt={productDetails.title} />
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={7}>
                                            <Typography className={classes.title} variant="h1" color="textPrimary">
                                                {productDetails.title}
                                            </Typography>
                                            <Grid container spacing={6}>
                                                <Grid item xs={6} md={6} lg={6}>
                                                    <Typography variant="h6" color="textPrimary" paragraph>
                                                        {productDetails.currency}{productDetails.price}
                                                    </Typography>    
                                                </Grid>
                                                <Grid className={classes.ratingWrapper} item xs={6} md={6} lg={6}>                                            
                                                    <Rating name="read-only" value={parseFloat(productDetails.rating)} precision={0.1} readOnly />
                                                    <Typography className={classes.ratingText} variant="subtitle2" color="textPrimary" paragraph display="inline">
                                                        {productDetails.rating}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Typography variant="body1" color="textSecondary" paragraph>
                                                {productDetails.description || 'No description available'}
                                            </Typography>
                                            <div className={classes.buttonWrapper}>
                                                <Button onClick={handleCheckout} variant="contained" color="secondary" size="large">Check out</Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Container>
                        </>
                    )
                }
        </div>
    )
}

export async function getStaticPaths() {
    const productList = await firestore.collection('products')
        .get().then(snapshot => {
            const listItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            return listItems
        }).catch(err => console.log(err))
    
    const paths = productList.map((product) => ({
        params: {
            slug: product.path
        },
    }))
    
        return {
        paths,
        fallback: false
    }
}

export const getStaticProps = async ({ params }) => {
    const productDetails = await firestore.collection('products')
        .where('path', '==', params.slug)
            .get().then(snapshot => {
                    const listItems = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    console.log(listItems)
                    return listItems[0]
        }).catch(err => console.log(err))

    return {
        props: {
            productDetails
        },
    }
}

export default ProductDetail