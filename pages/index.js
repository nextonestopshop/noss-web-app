import React, { useState, useEffect } from "react";
import Head from 'next/head'
import { makeStyles } from '@material-ui/core/styles';
import { firestore } from "../lib/firebase";
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Header from "../components/header";
import ProductCard from "../components/product-card";

const MetaTitle = 'Next One Stop Shop - Your Next Shopping Destination | NOSS'
const MetaDescription = 'Amazing gifts for your brother, sister, father, mother or anyone you would like to buy a gift for! Next one stop shop is your only shopping destinations to buy gifts for your loved ones. Explore 10,000+ curated ideas just for you.'

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
}))
            
const HomeComponent = ({ productList }) => {
    const classes = useStyles();

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
                    Next One Stop Shop | NOSS
                </Typography>
                <Typography className={classes.pageDescription} variant="subtitle1" color="textPrimary" paragraph>
                    Your shopping destination to buy gifts
                    for your loved ones! Specially curated lists to make it easy
                    for you to find the right gift.
                </Typography>

                <Toolbar />
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

export const getStaticProps = async () => {
  const productList = await firestore.collection('products')
      .get().then(snapshot => {
          const listItems = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
          }))
          return listItems
      }).catch(err => console.log(err))

  return {
    props: { productList },
  }
}

export default HomeComponent;
