import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

import ImageCropper from '../image-cropper'
import { storage } from '../../../firebase'
import { STORAGE_URL } from '../../../utils'

const useStyles = makeStyles((theme) => ({
    placeholder: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 0 15px',
        backgroundSize: 'contain'
    }
}));

const ImageUpload = ({ imageType, getUrl }) => {
    const classes = useStyles();
    const [inputImg, setInputImg] = useState('')
    const [imageName, setImageName] = useState('')
    const [imageUrl, setImageUrl] = useState(null)

    const onInputChange = (e) => {
        // convert image file to base64 string
        const file = e.target.files[0]
        setImageName(file.name)
        const reader = new FileReader()

        reader.addEventListener('load', () => {
            setInputImg(reader.result)
        }, false)

        if (file) {
            reader.readAsDataURL(file)
        }
    }

    const handleUrl = (path) => {
        storage
            .ref(`images/${imageType}`).child(imageName)
            .getDownloadURL()
            .then((res) => {
                console.log(res)
                setImageUrl(res)
                getUrl({ url: res, path: path, type: imageType }) 
            }).catch(err => {
                console.log(err)
            })
    }


    return (
        <div>
            {
                imageUrl ?
                    (
                        <div className={classes.placeholder} style={{ backgroundImage: `url(${imageUrl})` }}></div>
                    ):
                    (<div className={classes.placeholder}>
                        <PhotoLibraryIcon color="disabled" fontSize="large" />
                    </div>)
            }
            <Button variant="contained" component="label" >
                Upload image
                <input type='file' hidden accept='image/*' onChange={onInputChange} />
            </Button>
            {
                inputImg && (
                    <ImageCropper
                        getUrl={handleUrl}
                        inputImg={inputImg}
                        imageName={imageName}
                        imageType={imageType}
                        onExit={setInputImg}
                    />
                )
            }
        </div>
        // </form>
    )
}

export default ImageUpload