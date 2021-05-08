import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        cursor: 'pointer'
    },
    media: {
        height: 0,
        paddingTop: '80%',
    },
    heading: {
        fontSize: '1rem',
        cursor: 'pointer'
    },
    subheading: {
        fontSize: '0.8rem'
    },
    description: {
        marginBottom: '1.35rem',
        fontSize: '0.8rem',
        textAlign: 'justify'
    },
    productDetails: {
        paddingBottom: '16px !important'  
    }
}));

const ProductCard = ({data}) => {
    const classes = useStyles();
    const history = useHistory();
    console.log(data)

    const handleCheckout = () => {
        // history.push(`/product/${data.path}`)
        window.open(data.productUrl, "_blank")
    }

    const redirectToDetailPage = (e) => {
        e.stopPropagation()
        history.push(`/product/${data.path}`)
    }

    return (
        <Card className={classes.root} onClick={handleCheckout}>
            <CardHeader
                classes={{
                    subheader: classes.subheading
                }}
                title={<Typography onClick={redirectToDetailPage} className={classes.heading} variant="h5">{data.title}</Typography>}
                subheader={data.rating}
            />
            <CardMedia
                className={classes.media}
                image={data.imageUrl && data.imageUrl.url}
                title={data.imageUrl && data.imageUrl.path}
            />
            <CardContent className={classes.productDetails}>
                <Typography className={classes.description} variant="body2" color="textSecondary" component="p">
                    {data.description}
                </Typography>
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