import React, { useState, useEffect } from "react";
import { firestore } from "../../../../firebase";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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

const ProductListComponent = () => {
    const classes = useStyles();
    const history = useHistory();
    const [items, setItems] = useState([])

    useEffect(() => {
        firestore.collection('products')
            .get().then(snapshot => {
                const listItems = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                console.log(listItems)
                setItems(listItems)
            })
    }, []);

    const redirectToProductForm = () => {
        history.push("/admin/product");
    }

    const editProductItem = () => {

    }

    const deleteProductItem = () => {

    }

    return (
        <>
            <div className={classes.pageWrapper}>
                <Typography className={classes.title} variant="h6" noWrap>Product List</Typography>
                <Button className={classes.addButton} onClick={redirectToProductForm} variant="contained" color="primary">Add New Product</Button>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Product name</TableCell>
                                <TableCell>Channel</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">{row.title}</TableCell>
                                <TableCell component="th" scope="row">{row.channel}</TableCell>
                                <TableCell component="th" scope="row" align="right">
                                    <IconButton
                                        aria-label="Edit"
                                        aria-haspopup="true"
                                        onClick={editProductItem}
                                        color="inherit">
                                        <EditIcon fontSize="small" />
                                    </IconButton> 
                                    <IconButton
                                        aria-label="Delete"
                                        aria-haspopup="true"
                                        onClick={deleteProductItem}
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
        </>
    )
}

export default ProductListComponent;