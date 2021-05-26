import React from "react";
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import { firestore } from "../../../lib/firebase";

import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Header from "../../../components/header";
import ProductCard from "../../../components/product-card";

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.up('lg')]: {
            maxWidth: '1160px'
        },
    },
    pageTitle: {
        textAlign: 'center',
        fontSize: '2rem',
        marginBottom: '20px',
        [theme.breakpoints.up('md')]: {
            fontSize: '3rem',
        }
    },
    pageDescription: {
        textAlign: 'center',
        maxWidth: '590px',
        margin: 'auto'
    }
}));

const CategoryPage = ({ productList, categoryName }) => {
    const classes = useStyles()
    const router = useRouter()
    const MetaTitle = `${categoryName} | NOSS`
    const MetaDescription = `Curated list of ${categoryName} items just for you. Find the perfect gift for your loved ones on Next One Stop Shop`

    return (
        <>
            <Head>
                <title key="title">{MetaTitle}</title>
                <meta key="description" name="description" content={MetaDescription} />
                <meta property="og:title" content={MetaTitle} />
                <meta property="og:description" content={MetaDescription} />
                <meta property="og:image" content="https://nosswebapp.web.app/images/noss-logo.png" />
            </Head>
            <Header />
            <Container maxWidth="lg" className={classes.root}>
                <Toolbar />
                <Toolbar />

                <Typography className={ classes.pageTitle } variant="h1" color="textPrimary">
                    {categoryName}
                </Typography>
                <Typography className={classes.pageDescription} variant="subtitle1" color="textPrimary" paragraph>
                    Curated list of {categoryName} items just for you. Find the perfect gift for your loved ones.
                </Typography>

                <div className="home-wrapper">
                    <Toolbar />
                    <Grid container spacing={6}>
                        {
                            productList && productList.map((product) => {
                                return (
                                    <Grid key={product.id} item xs={12} sm={6} md={6} lg={4} >
                                        <ProductCard key={product.id} data={product} />
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </div>
            </Container>
        </>
    )
}
    
export async function getStaticPaths() {
    const categoryList = await firestore.collection('category')
        .where('parentId', '==', '')
        .get().then(snapshot => {
            const listItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            return listItems
        }).catch(err => console.log(err))

    const paths = categoryList.map((category) => ({
        params: {
            categoryPath: category.path
        },
    }))

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps = async ({ params }) => {
    const categoryDetails = await firestore.collection('category')
        .where('path', '==', params.categoryPath)
        .get().then(snapshot => {
            const listItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            console.log(listItems)
            return listItems[0]
        }).catch(err => console.log(err))
    
    const categoryName = categoryDetails.name

    const productList = await firestore.collection('products')
        .where('category.categoryId', '==', categoryDetails.id)
        .get().then(snapshot => {
            const listItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            return listItems
        }).catch(err => console.log(err))

    return {
        props: { productList, categoryName },
    }
}

export default CategoryPage
