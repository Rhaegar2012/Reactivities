import React, { useState,useEffect } from "react";
import { Grid, Header,Button } from "semantic-ui-react";
import {Cropper} from 'react-cropper'
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";





export default function PhotoUploadWidget(){
    const[files,setFiles] = useState<any>([]);
    const[cropper,setCropper] = useState<Cropper>();
    function onCrop(){
        if(cropper){
            cropper.getCroppedCanvas().toBlob(blob=>console.log(blob));
        }
    }

    useEffect(()=>{
        return()=>{
            files.forEach((file:any)=> URL.revokeObjectURL(file.preview))
        }
    },[files])
    return(
        <Grid>
            <Grid.Column width={4}>
                <Header color='teal' content='Step 1 - Add Photo'/>
                <PhotoWidgetDropzone setFiles={setFiles}/>
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header color='teal' content='Step 2 - Resize Image'/>
                {files && files.length>0 &&(
                    <PhotoWidgetCropper setCropper ={setCropper} imagePreview={files[0].preview}/>
                )}
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header color='teal' content='Step 3 - Preview & Upload'/>
                <div className='img-preview' style={{minHeight:200,overflow:'hidden'}}/>
                <Button.Group widths={2}>
                    <Button onClick={onCrop} positive icon='check'/>
                    <Button onClick={()=> setFiles([])} icon='check'/>
                </Button.Group>
            </Grid.Column>
        </Grid>
    )
}