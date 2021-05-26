import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Link from 'next/link'

const useStyles = makeStyles((theme) => ({
    root: {
        // cursor: 'pointer'
        border: '1px solid #ccc',
        borderRadius: '0'
    },
    media: {
        width: '100%',
        height: '0',
        paddingTop: '100%',
        position: 'relative',
        background: '#eee'
    },
    productImage: {
        width: '100%',
        cursor: 'pointer',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%'
    },
    heading: {
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: '400',
        color: 'rgba(0, 0, 0, 0.87)'
    },
    subheading: {
        fontSize: '0.8rem'
    },
    description: {
        marginBottom: '10px',
        fontSize: '0.8rem',
        textAlign: 'justify',
        minHeight: '90px',
        maxHeight: '90px',
        overflow: 'hidden'
    },
    productDetails: {
        paddingBottom: '16px !important'  
    }
}));

const ProductCard = ({data}) => {
    const classes = useStyles();

    const handleCheckout = () => {
        // history.push(`/product/${data.path}`)
        window.open(data.productUrl, "_blank")
    }

    // const redirectToDetailPage = (e) => {
    //     e.stopPropagation()
    //     history.push(`/product/${data.path}`)
    // }

    return (
        <Card className={classes.root} elevation={0}>
            <CardHeader
                classes={{
                    subheader: classes.subheading
                }}
                title={<Link href={`/product/${data.path}`}><a><Typography className={classes.heading} variant="h2">{data.title}</Typography></a></Link>}
                subheader={data.rating}
            />
            <CardMedia onClick={handleCheckout} className={classes.media}>
                <img className={classes.productImage} src={data.imageUrl && data.imageUrl.url} title={data.title} />
            </CardMedia>
            <CardContent className={classes.productDetails}>
                {
                    data.description && 
                        (<Typography className={classes.description} variant="body2" color="textSecondary" component="p">
                            {data.description}
                        </Typography>)
                }
                <Grid container spacing={3} direction="row" justify="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle2" color="textSecondary" component="p">{data.currency}{data.price}</Typography>
                    </Grid>
                    <Grid item>
                        <Button onClick={handleCheckout} variant="contained" color="secondary" size="medium">Check out</Button>                        
                    </Grid>
                </Grid>
                        
            </CardContent>
        </Card>
    )
}

export default ProductCard;