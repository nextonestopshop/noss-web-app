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

import Header from "../../../../components/header";
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

const CategoryListComponent = ({ categoryList }) => {
    const classes = useStyles();
    const router = useRouter();
    const [items, setItems] = useState([])

    useEffect(() => {
        let formattedList = formatCategoryList(categoryList)
        console.log(formattedList)
        setItems(formattedList)
    }, []);

    const formatCategoryList = (list) => {
        let formattedList = []
        list.map((item) => {
            if(!item.parentId) {
                formattedList.push(item)
            } else {
                formattedList.map((formattedItem) => {
                    if(formattedItem.id === item.parentId) {
                        if(!formattedItem.hasOwnProperty('subCategory')) {
                            formattedItem['subCategory'] = []
                            }
                        formattedItem.subCategory.push(item)
                    }
                })
            }
        })
        return formattedList
    }

    const redirectToProductForm = () => {
        router.push("/admin/category/add");
    }

    const editProductItem = () => {

    }

    const deleteProductItem = () => {

    }

    return (
        <>
            <Header />
            <LeftDrawer />
            <div className="adminContainer">
                <Toolbar />
                <div className={classes.pageWrapper}>
                    <Typography className={classes.title} variant="h6" noWrap>Category List</Typography>
                    <Button className={classes.addButton} onClick={redirectToProductForm} variant="contained" color="primary">Add New Category</Button>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Category name</TableCell>
                                    <TableCell>Sub categories</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell component="td" scope="row">{row.name}</TableCell>
                                    <TableCell component="td" scope="row">{
                                        row.subCategory ? 
                                            (
                                                row.subCategory.map((subCat) => {
                                                    return (<span key={subCat.id}> {subCat.name}, </span>)
                                                })
                                            ) : '-'
                                    }</TableCell>
                                    <TableCell component="td" scope="row" align="right">
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
            </div>
        </>
    )
}

export const getStaticProps = async () => {
    const categoryList = await firestore.collection('category').orderBy('parentId')
        .get().then(snapshot => {
            const listItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            return listItems
        }).catch(err => console.log(err))

    return {
        props: {
            categoryList
        },
    }
}

export default CategoryListComponent;