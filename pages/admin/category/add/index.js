import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { firestore } from "../../../../lib/firebase";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';

import { withSnackbar } from '../../../../components/toast-message';
import Header from "../../../../components/header";
import LeftDrawer from "../../../../components/left-drawer";


const useStyles = makeStyles((theme) => ({
    card: {
        padding: '16px 24px'

    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    }
}));

const AddCategoryComponent = withSnackbar((props) => {
    const classes = useStyles();
    const router = useRouter();

    const [state, setState] = useState({
        categoryName: '',
        parentId: '',
    })
    const [category, setCategory] = useState([])
    

    const handleSubmit = (e) => {
        e.preventDefault()
        firestore.collection('category').doc().set({
            name: state.categoryName,
            parentId: state.parentId
        }).then(() => {
            props.snackbarShowMessage(`Category ${state.categoryName} added`);
            router.push("/admin/category/list");
        }).catch((err) => {
            props.snackbarShowMessage(`Error - ${err}`);
        })
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setState({ ...state, [name]: value })
    }

    const handleAutocompleteChange = (type, item) => {
        setState({ ...state, [type]: item.id })
    }

    const getCategoryBasedOnParentId = async (id) => {
        return await firestore.collection('category')
            .where('parentId', '==', id)
            .orderBy('name')
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
            let list = await getCategoryBasedOnParentId('')
            console.log(list)
            setCategory(list)
        })()
    }, [])

    return (
        <>
            <Header />
            <LeftDrawer />
            <div className="adminContainer">
                <Toolbar />
                <Paper className={classes.card}>
                    <form className={classes.form} noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <TextField value={state.categoryName} onChange={handleInputChange} variant="outlined" required size="small" fullWidth id="categoryName" label="Category Name" name= "categoryName" autoFocus />
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <Autocomplete id="parent" size="small" options={category}
                                    getOptionLabel={(option) => option.name} fullwidth
                                    onChange={(e, item) => handleAutocompleteChange('parentId', item)}
                                    renderInput={(params) => <TextField {...params} label="Parent" name="parent" variant="outlined" />}
                                />
                            </Grid>
                        </Grid>
                        <Grid container direction="row" justify="flex-end" alignItems="center" spacing={3}>
                            <Grid item>
                                <Button color="primary" size="large" onClick={() => router.push("/admin/category/list")}>Cancel</Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" size="large" type="submit">Submit</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </div>
        </>
    )
})

export const getStaticProps = async () => {
    return {
        props: {}
    }
}

export default AddCategoryComponent