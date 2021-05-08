import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { makeStyles } from '@material-ui/core/styles';
import { firestore } from "../../../../firebase";

import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Header from "../../../../common/components/header";
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import placeholder from '../../../../assets/images/placeholder.png';

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: '15px',
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

const ProductDetailComponent = (props) => {
    const classes = useStyles();
    const [productDetails, setProductDetails] = useState(null)
    const param = props.match.params.id
    
    const getProductDetails = async () => {
        return await firestore.collection('products')
            .where('path', '==', param)
            .get().then(snapshot => {
                    const listItems = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    console.log(listItems)
                    return listItems[0]
                }).catch(err => console.log(err))
    }
    
    const handleCheckout = () => {
        window.open(productDetails.productUrl, "_blank")
    }

    const handleClick = () => {}

    useEffect(() => {
        (async function () {
            if (!productDetails) {
                let product_details = await getProductDetails()
                console.log(product_details)
                setProductDetails(product_details)
            }
        })()
    }, [])

    return (
        <>
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
                                    <Link color="inherit" href="/">
                                        {productDetails.category[0].categoryName}
                                    </Link>
                                    <Link color="inherit" href="/">
                                        {productDetails.category[0].subCategoryName}
                                    </Link>
                                </Breadcrumbs>
                            </Container>
                                
                            <Container maxWidth="md" className={classes.root}>
                                <div className="home-wrapper">
                                    <Toolbar />
                                    <Grid container spacing={6}>
                                        <Grid item xs={12} md={6} lg={5}>
                                            <img className={classes.productImage} src={productDetails.imageUrl ? productDetails.imageUrl.url : placeholder}
                                                alt={productDetails.imageUrl ? productDetails.imageUrl.path : 'No image availbale'} />
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={7}>
                                            <Typography className={classes.title} variant="h5" color="textPrimary" paragraph>
                                                {productDetails.title}
                                            </Typography>
                                            <Grid container spacing={6}>
                                                <Grid item xs={6} md={6} lg={6}>
                                                    <Typography variant="h6" color="textPrimary" paragraph>
                                                        {productDetails.currency}{productDetails.price}
                                                    </Typography>    
                                                </Grid>
                                                <Grid className={classes.ratingWrapper} item xs={6} md={6} lg={6}>                                            
                                                    <Rating name="read-only" value={productDetails.rating} precision={0.1} readOnly />
                                                    <Typography className={classes.ratingText} variant="subtitle2" color="textPrimary" paragraph display="inline">
                                                        {productDetails.rating}/5
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Typography variant="body1" color="textSecondary" paragraph>
                                                {productDetails.description || 'No description available'}
                                            </Typography>
                                            <div className={classes.buttonWrapper}>
                                                <Button onClick={handleCheckout} variant="contained" color="secondary" size="Large">Check out</Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Container>
                        </>
                    )
                }
        </>
    )
}

export default withRouter(ProductDetailComponent);
