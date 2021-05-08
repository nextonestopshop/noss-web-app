import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { firestore } from "../../../../firebase";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import ImageUpload from '../../../../common/components/image-upload'
import { withSnackbar } from '../../../../common/components/toast-message';
import { getCategoryBasedOnParentId } from '../service'

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
    const history = useHistory();

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
            history.push("/admin/category-list");
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

    useEffect(() => {
        (async function () {
            let list = await getCategoryBasedOnParentId('')
            console.log(list)
            setCategory(list)
        })()
        // let categoryList = getCategoryBasedOnParentId('')
        // setCategory(categoryList)
    }, [])

    return (
        <>
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
                            <Button color="primary" size="large">Cancel</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" size="large" type="submit">Submit</Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </>
    )
})

export default AddCategoryComponent