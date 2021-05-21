import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { storage } from '../../lib/firebase'
import Cropper from 'react-easy-crop'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import { getCroppedImg } from './cropImage'

const useStyles = makeStyles((theme) => ({
    cropper: {
        position: 'relative',
        height: '100%'
    }
}));

const ImageCropper = ({ getUrl, inputImg, onExit, imageType, imageName }) => {
    const classes = useStyles();
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [open, setOpen] = useState(true)
    const [blob, setBlob] = useState(null)

    /* onCropComplete() will occur each time the user modifies the cropped area, 
    which isn't ideal. A better implementation would be getting the blob 
    only when the user hits the submit button, but this works for now  */
    const onCropComplete = async (_, croppedAreaPixels) => {
        const croppedImage = await getCroppedImg(
            inputImg,
            croppedAreaPixels
        )
        setBlob(croppedImage)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmitImage = (e) => {
        // upload blob to firebase 'images' folder with filename 'image'
        e.preventDefault()
        storage
            .ref(`images/${imageType}`).child(imageName)
            .put(blob, { contentType: blob.type })
            .then((res) => {
                getUrl(res.ref.fullPath)
                handleClose()
            }).catch(err => {
                console.log(err)
                handleClose()
            })
    }

    return (
        /* need to have a parent with `position: relative` 
    to prevent cropper taking up whole page */
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} fullScreen onExited={() => onExit('')}>
            <DialogContent dividers>
                <div className={classes.cropper}> 
                    <Cropper
                        image={inputImg}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleSubmitImage} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
            
    )
}

export default ImageCropper