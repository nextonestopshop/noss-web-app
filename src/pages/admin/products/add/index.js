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
import { getCategoryBasedOnParentId } from '../../category/service'

const useStyles = makeStyles((theme) => ({
    card: {
        padding: '16px 24px'

    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    addTag: {
        position: 'absolute',
        top: '-5px',
        right: '12px',
        fontSize: '0.8rem',
        color: '#3f51b5',
        cursor: 'pointer',
        textDecoration: 'underline'
    }
}));

const AddProductComponent = () => {
    const classes = useStyles();
    const history = useHistory();
    const [state, setState] = useState({
        title: '',
        channel: '',
        productUrl: '',
        currency: '',
        price: '',
        rating: '',
        description: '',
        imageUrl: null
    })
    const [category, setCategory] = useState(null)
    const [categoryList, setCategoryList] = useState([])
    const [subCategory, setSubCategory] = useState(null)
    const [subCategoryList, setSubCategoryList] = useState([])
    const [tag, setTag] = useState(null)
    const [tags, setTags] = useState([])
    const [tagsList, setTagsList] = useState([])
    
    const handleSubmit = (e) => {
        e.preventDefault()
        let params = {
            ...state,
            path: generatePath(state.title),
            category: subCategory ? [{
                categoryId: category.id,
                categoryName: category.name,
                subCategoryId: subCategory.id,
                subCategoryName: subCategory.name
            }] : [],
            tags
        }
        console.log(params)
        firestore.collection('products').add(params)
            .then(res => {
                history.push('/admin/product-list')
            }).catch(err => console.log(err))

    } 

    const generatePath = (val) => {
        if (val) {
            let formattedValue = val.toLowerCase().split(' ').join('-')
            return formattedValue
        }
    }

    const getImageData = (data) => {
        setState({ ...state, imageUrl: data })
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setState({ ...state, [name]: value })
    }

    const handleAutocompleteChange = (type, item) => {
        setState({ ...state, [type]: item.value })

    }

    const handleSubCategoryChange = (item) => {
        setSubCategory(item ? item : null)

    }

    const handleCategoryChange = async (item) => {
        if (item) {
            let list = await getCategoryBasedOnParentId(item.id)
            setSubCategoryList(list)
            setCategory(item)
        } else {
            setSubCategoryList([])
            setCategory(null)
        }
    }

    const handleTagsChange = (e) => {
        let tag_list = e.target.value
        let tags_arr = tag_list.split(',')
        setTags(tags_arr || [])
    }

    /** const handleTagsKeyDown = (e) => {
        let tag_name = e.target.value
        setTag(tag_name)
        console.log(tag_name)
    }

    const addTag = () => {
        if (tag) {
            firestore.collection('tags').add({
                name: tag
            }).then((res) => {
                console.log(res)
                setTagsList([...tagsList, { name: tag, id: res.id }])
                setTags([...tags, { name: tag, id: res.id }])
                
            }).catch(err => console.log(err))
        }
    } */

    const getTagsList = async () => {
        return await firestore.collection('tags')
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
            if (!categoryList.length) {
                let category_list = await getCategoryBasedOnParentId('')
                setCategoryList(category_list)
            }
            if (!tagsList.length) {
                let tag_list = await getTagsList()
                setTagsList(tag_list)
            }
        })()
    }, [])

    return (
        <>
            <Paper className={classes.card}>
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <ImageUpload imageType={'products'} getUrl={getImageData} />
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField value={state.title} onChange={handleInputChange} variant="outlined" required size="small" fullWidth id="title" label="Title" name= "title" autoFocus />
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <Autocomplete id="channel" size="small" options={[
                                            { value: 'amazon', label: 'Amazon' },
                                            { value: 'etsy', label: 'Etsy' }
                                        ]}
                                        getOptionLabel={(option) => option.label} fullwidth
                                        onChange={(e, item) => handleAutocompleteChange('channel', item)}
                                        renderInput={(params) => <TextField {...params} label="Channel" name="channel" variant="outlined" />}
                                    />
                                </Grid>
                                <Grid item md={9} xs={12}>
                                    <TextField value={state.productUrl} onChange={handleInputChange} variant="outlined" required size="small" fullWidth id="productUrl" label="Product URL" name= "productUrl" />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Grid container spacing={0}>
                                        <Grid item xs={4}>
                                            <Autocomplete id="currency" size="small" options={[
                                                    { value: '$', label: '$' },
                                                    { value: '₹', label: '₹' },
                                                    { value: '£', label: '£' },
                                                    { value: '€', label: '€' },
                                                ]}
                                                getOptionLabel={(option) => option.label} fullwidth
                                                onChange={(e, item) => handleAutocompleteChange('currency', item)}
                                                renderInput={(params) => <TextField {...params} label="Currency" variant="outlined" />} />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField value={state.price} onChange={handleInputChange} variant="outlined" required size="small" fullWidth id="price" label="Price" name= "price" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField value={state.rating} onChange={handleInputChange} variant="outlined" size="small" fullWidth id="rating" label="Rating" name= "rating" />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Autocomplete id="category" size="small" options={categoryList}
                                        getOptionLabel={(option) => option.name} fullwidth
                                        onChange={(e, item) => handleCategoryChange(item)}
                                        renderInput={(params) => <TextField {...params} label="Category" variant="outlined" />} />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Autocomplete id="subcategory" size="small" options={subCategoryList} 
                                        getOptionLabel={(option) => option.name} fullwidth
                                        onChange={(e, item) => handleSubCategoryChange(item)}
                                        renderInput={(params) => <TextField {...params} label="Sub-Category" variant="outlined" />} />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <TextField value={state.tags} onChange={handleTagsChange} variant="outlined" size="small" fullWidth id="tags" label="Tags" name= "tags" />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField value={state.description} onChange={handleInputChange} variant="outlined" size="small" fullWidth id="description" multiline rows={4} label="Description" name= "description" />
                                </Grid>
                            </Grid>
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
}

export default AddProductComponent;

// <Grid item md={4} xs={12} style={{ display: 'none'}}>
//                                     {tag ? (<div className={classes.addTag} onClick={addTag}>Add "{tag}" as a tag</div>) : null}
//                                     <Autocomplete id="subcategory" size="small" options={tagsList} fullwidth
//                                         getOptionLabel={(option) => option.name} multiple limitTags={2}
//                                         onChange={(e, item) => handleTagsChange(item)}
//                                         value={tags}
//                                         renderInput={(params) => {
//                                             params.inputProps.onKeyUp = handleTagsKeyDown;
//                                             return (
//                                                 <TextField {...params} label="Tags" value={tag} variant="outlined" />
//                                             )
//                                         }} />
//                                 </Grid>