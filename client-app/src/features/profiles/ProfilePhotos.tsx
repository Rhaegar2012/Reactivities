import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import {Card,Header,Tab,Image, Grid, Button} from 'semantic-ui-react';
import { Profile } from "../../app/models/profile";

import { useStore } from "../../app/stores/store";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";

interface Props{
    profile:Profile;
}

export default observer( function ProfilePhotos({profile}:Props){
    const {profileStore: {isCurrentUser}} = useStore();
    const [addPhotoMode,setAddPhotoMode]  = useState(false);
    return(
        <Tab>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon ='image'content='Photos'/>
                    {isCurrentUser &&(
                        <Button floated ='right' basic content={addPhotoMode ?'Cancel':'Add Photo'}
                                onClick={()=>setAddPhotoMode(!addPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column>
                    {addPhotoMode?(
                        <PhotoUploadWidget/>
                    ):(
                        <Card.Group itemsPerRow={5}>
                        {profile.photos?.map((photo: { id: React.Key | null | undefined; url: any; })=>(    
                            <Card key={photo.id}>
                            <Image src={photo.url}/>
                        </Card>))}
                     
                    </Card.Group>

                    )}
                </Grid.Column>
            </Grid>
            
       

        </Tab>
    )

})