import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { firestore } from "../../firebase";
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Header from "../../common/components/header";
import ProductCard from "../../common/components/product-card";

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.up('lg')]: {
            maxWidth: '1160px'
        },
    },
}))
            
const HomeComponent = () => {
    const classes = useStyles();
    const [productList, setProductList] = useState(null)

    const getProductList = async() => {
        return await firestore.collection('products')
            .get().then(snapshot => {
                    const listItems = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    return listItems
                }).catch(err => console.log(err))
    }

    useEffect(() => {
        (async function () {
            if (!productList) {
                let product_list = await getProductList()
                console.log(product_list)
                setProductList(product_list)
            }
        })()
    }, [])

    return (
        <>
            <Header />
            <Container maxWidth="lg" className={classes.root}>
                <Toolbar />
                <div className="home-wrapper">
                    <Toolbar />
                    <Grid container spacing={6}>
                        {
                            productList && productList.map((product) => {
                                return (
                                    <Grid key={product.id} item xs={12} md={6} lg={4}>                    
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

export default HomeComponent;