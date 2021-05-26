import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useRouter, withRouter } from 'next/router';
import { firestore } from "../../../../lib/firebase";
import { generatePath } from "../../../../lib/utils";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';

import ImageUpload from '../../../../components/image-upload'
import Header from "../../../../components/header";
import LeftDrawer from "../../../../components/left-drawer";
import {withSnackbar} from "../../../../components/toast-message";

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

const AddProductComponent = withSnackbar((props) => {
    const classes = useStyles();
    const router = useRouter();
    const [state, setState] = useState({
        title: '',
        channel: '',
        productUrl: '',
        currency: '',
        price: '',
        rating: '',
        description: '',
        // tags: '',
        imageUrl: null
    })
    const [category, setCategory] = useState({})
    const [categoryList, setCategoryList] = useState([])
    const [subCategory, setSubCategory] = useState({})
    const [subCategoryList, setSubCategoryList] = useState([])
    const [tag, setTag] = useState(null)
    const [tags, setTags] = useState([])
    const [tagsList, setTagsList] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [productId, setProductId] = useState(null)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        let params = {
            ...state,
            path: generatePath(state.title),
            category: subCategory ? {
                categoryId: category.id,
                categoryName: category.name,
                subCategoryId: subCategory.id,
                subCategoryName: subCategory.name
            } : null,
            tags: tags ? tags.split(',') : []
        }
        console.log(params)
        if (isEdit) {
            updateProduct(params)
        } else {
            saveNewProduct(params)
        }
    }
    
    const saveNewProduct = (params) => {
        firestore.collection('products').doc().set(params)
            .then(res => {
                router.push('/admin/products/list')
                props.snackbarShowMessage(`New Product added successfully`)
            }).catch(err => {
                console.log(err)
                props.snackbarShowMessage(error, 'error')
            })
    }

    const updateProduct = (params) => {
        firestore.collection('products').doc(productId).update(params)
            .then(res => {
                router.push('/admin/products/list')
                props.snackbarShowMessage(`Product updated successfully`)
            }).catch(err => {
                console.log(err)
                props.snackbarShowMessage(error, 'error')
            })
    }

    const getImageData = (data) => {
        setState({ ...state, imageUrl: data })
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setState({ ...state, [name]: value })
    }

    const handleAutocompleteChange = (type, item) => {
        setState({ ...state, [type]: item })

    }

    const handleSubCategoryChange = (item) => {
        setSubCategory(item ? item : null)

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
    
    const handleCategoryChange = async (item) => {
        if (item) {
            let list = await getCategoryBasedOnParentId(item.id)
            list = list.map(subCat => ({ id: subCat.id, name: subCat.name }))
            setSubCategoryList(list)
            setCategory(item)
        } else {
            setSubCategoryList([])
            setCategory(null)
        }
    }

    const handleTagsChange = (e) => {
        let tag_list = e.target.value
        // let tags_arr = tag_list.split(',')
        setTags(tag_list || '')
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

    const setFormDataonEdit = () => {
        setIsEdit(true)
        let productData = JSON.parse(props.router.query.data)
        console.log(productData)
        
        setProductId(productData.id)

        setState({
            title: productData.title || '',
            channel: productData.channel || '',
            productUrl: productData.productUrl || '',
            currency: productData.currency || '',
            price: productData.price || '',
            rating: productData.rating || '',
            description: productData.description || '',
            imageUrl: productData.imageUrl || null
            // tags: productData.tags ? productData.tags.join() : ''
        })

        let tag_list = productData.tags ? productData.tags.join() : ''
        setTags(tag_list)
        
        let category_item = productData.category ? {
            id: productData.category.categoryId,
            name: productData.category.categoryName
        } : {}
        setCategory(category_item)
        
        let subcategory_item = productData.category ? {
            id: productData.category.subCategoryId,
            name: productData.category.subCategoryName
        } : {}
        setSubCategory(subcategory_item)
    }

    useEffect(() => {
        (async function () {
            if (!categoryList.length) {
                let category_list = await getCategoryBasedOnParentId('')
                category_list = category_list.map(cat => ({ id: cat.id, name: cat.name }))
                setCategoryList(category_list)
            }
            if (router.query.data) {
                setFormDataonEdit()
            }
            // if (!tagsList.length) {
            //     let tag_list = await getTagsList()
            //     setTagsList(tag_list)
            // }
        })()
    }, [router])

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
                                <ImageUpload imageType={'products'} getUrl={getImageData} defaultValue={state.imageUrl} />
                            </Grid>
                            <Grid item xs={12} md={9}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField value={state.title} onChange={handleInputChange} variant="outlined" required size="small" fullWidth id="title" label="Title" name= "title" autoFocus />
                                    </Grid>
                                    <Grid item md={3} xs={12}>
                                        <Autocomplete id="channel" size="small" options={['amazon', 'etsy']}
                                            value={state.channel}
                                            getOptionLabel={(option) => option || ''} fullwidth
                                            onChange={(e, item) => handleAutocompleteChange('channel', item)}
                                            getOptionSelected={(option, selected) => option === selected}
                                            renderInput={(params) => <TextField {...params} label="Channel" name="channel" variant="outlined" />}
                                        />
                                    </Grid>
                                    <Grid item md={9} xs={12}>
                                        <TextField value={state.productUrl} onChange={handleInputChange} variant="outlined" required size="small" fullWidth id="productUrl" label="Product URL" name= "productUrl" />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Grid container spacing={0}>
                                            <Grid item xs={4}>
                                                <Autocomplete id="currency" size="small" options={['$', '₹', '£', '€']}
                                                    value={state.currency}
                                                    getOptionLabel={(option) => option || ''} fullwidth
                                                    onChange={(e, item) => handleAutocompleteChange('currency', item)}
                                                    getOptionSelected={(option, selected) => option === selected}
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
                                            value={category}
                                            getOptionLabel={(option) => option.name || ''} fullwidth
                                            onChange={(e, item) => handleCategoryChange(item)}
                                            getOptionSelected={(option, selected) => option.id === selected.id}
                                            renderInput={(params) => <TextField {...params} label="Category" variant="outlined" />} />
                                    </Grid>
                                    <Grid item md={4} xs={12}>
                                        <Autocomplete id="subcategory" size="small" options={subCategoryList}
                                            value={subCategory}
                                            getOptionLabel={(option) => option.name || ''} fullwidth
                                            onChange={(e, item) => handleSubCategoryChange(item)}
                                            getOptionSelected={(option, selected) => option.id === selected.id}
                                            renderInput={(params) => <TextField {...params} label="Sub-Category" variant="outlined" />} />
                                    </Grid>
                                    <Grid item md={4} xs={12}>
                                        <TextField value={tags} onChange={handleTagsChange} variant="outlined" size="small" fullWidth id="tags" label="Tags" name= "tags" />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <TextField value={state.description} onChange={handleInputChange} variant="outlined" size="small" fullWidth id="description" multiline rows={4} label="Description" name= "description" />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" justify="flex-end" alignItems="center" spacing={3}>
                            <Grid item>
                                <Button color="primary" size="large" onClick={() => router.push('/admin/products/list')}>Cancel</Button>
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

export default withRouter(AddProductComponent);
