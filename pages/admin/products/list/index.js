import React, { useState, useEffect } from "react";
import { firestore } from "../../../../lib/firebase";
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import Header from "../../../../components/header";
import {withSnackbar} from "../../../../components/toast-message";
import LeftDrawer from "../../../../components/left-drawer";

const useStyles = makeStyles({
    pageWrapper: {
        position: 'relative'
    },
    addButton: {
        position: 'absolute',
        right: '20px',
        top: '-5px'
    },
    title: {
        marginBottom: '15px',
        padding: '0 15px 5px',
        borderBottom: '1px solid #e5e5e5'
    },
    table: {
        minWidth: 650,
    },
});

const ProductListComponent = withSnackbar(({ list, snackbarShowMessage }) => {
    const classes = useStyles();
    const router = useRouter();
    const [productList, setProductList] = useState(list)
    const [openModal, setOpenModal] = useState(false)
    const [selectedId, setSelectedId] = useState(null)

    console.log(productList)
    
    const redirectToProductForm = () => {
        router.push("/admin/products/add");
    }

    const editProductItem = (item) => {
        router.push({
            pathname: '/admin/products/add',
            query: {data: JSON.stringify(item)}
        })
    }

    const askConfirmation = (item) => {
        setSelectedId(item.id)
        setOpenModal(true)
    }

    const deleteProductItem = () => {
        firestore.collection('products').doc(selectedId).delete().then(() => {
            handleClose()
            snackbarShowMessage(`Product deleted successfully`)
            setProductList(productList.filter(product => product.id !== selectedId))
        }).catch((error) => {
            console.error("Error removing document: ", error);
            snackbarShowMessage(error, "error")
        });
    }

    const handleClose = () => {
        setOpenModal(false)
    }

    return (
        <>
            <Header />
            <LeftDrawer />
            <div className="adminContainer">
                <Toolbar />

                <div className={classes.pageWrapper}>
                    <Typography className={classes.title} variant="h6" noWrap>Product List</Typography>
                    <Button className={classes.addButton} onClick={redirectToProductForm} variant="contained" color="primary">Add New Product</Button>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Sub-category</TableCell>
                                    <TableCell>Channel</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productList && productList.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell component="td" scope="row">{row.title}</TableCell>
                                    <TableCell component="td" scope="row">{row.category && row.category.categoryName}</TableCell>
                                    <TableCell component="td" scope="row">{row.category && row.category.subCategoryName}</TableCell>
                                    <TableCell component="td" scope="row">{row.channel}</TableCell>
                                    <TableCell component="td" scope="row" align="right">
                                        <IconButton
                                            aria-label="Edit"
                                            aria-haspopup="true"
                                            onClick={() => editProductItem(row)}
                                            color="inherit">
                                            <EditIcon fontSize="small" />
                                        </IconButton> 
                                        <IconButton
                                            aria-label="Delete"
                                            aria-haspopup="true"
                                            onClick={() => askConfirmation(row)}
                                            color="inherit">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton> 
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <Dialog open={openModal} onClose={handleClose}>
                <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={deleteProductItem} color="primary" autoFocus>yes, Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    )
})

export const getStaticProps = async () => {

    // const list = [{
    //     category: {
    //         categoryId: "vGVtjTUOdXPKiGaBz3xP",
    //         categoryName: "Collector Items",
    //         subCategoryId: "O2al1NGx5G7xOgP136pX",
    //         subCategoryName: "Bar Items"
    //     },
    //     channel: "amazon",
    //     currency: "$",
    //     description: "Create your own beer at home with this amazing automated beer brewer kit. Now it's never been easier to set up your very own microbrewery! It has everything you need to start making your own beer and makes for a very unique gift for any beer lover.",
    //     id: "14MF9sp2nZwsfsLnE360",
    //     imageUrl: {
    //         url: "https://firebasestorage.googleapis.com/v0/b/nosswebapp.appspot.com/o/images%2Fproducts%2FNOSS_0023.jpg?alt=media&token=d9f11aba-3909-4765-9fa2-fe26672b37b4",
    //         type: "products",
    //         path: "images/products/NOSS_0023.jpg"
    //     },
    //     path: "fully-automated-beer-brewer",
    //     price: "448",
    //     productUrl: "https://www.amazon.com/BeerDroid-Automated-Brewing-American-BrewPrint/dp/B07558KHBD/ref=sr_1_1_sspa",
    //     rating: "4.3",
    //     tags: ["Brewer", "Beer Brewer", "Brewery", "Beer Maker", "Wheat Beer Maker"],
    //     title: "Fully Automated Beer Brewer"
    // }]
    const list = await firestore.collection('products')
        .get().then(snapshot => {
            const listItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            return listItems
        }).catch(err => console.log(err))

    return {
        props: { list },
    }
}


export default ProductListComponent;