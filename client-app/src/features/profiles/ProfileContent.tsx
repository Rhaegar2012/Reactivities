import React from 'react';
import {Tab} from 'semantic-ui-react'
import { Profile } from '../../app/models/profile';
import { observer } from 'mobx-react-lite';
import ProfilePhotos from './ProfilePhotos';

interface Props{
    profile: Profile;
}

export default observer(function ProfileContent({profile}:Props){
    const panes =[
        {menuItem:'About',render:()=>   <Tab>About Content</Tab>},
        {menuItem:'Photos',render:()=>  <ProfilePhotos profile={profile}/>},
        {menuItem:'Events',render:()=>  <Tab>Events Content</Tab>},
        {menuItem:'Followers',render:()=><Tab>Followers Content</Tab>},
        {menuItem:'Following',render:()=><Tab>Following Content</Tab>},
    ];

    return(
        <Tab
            menu ={{fluid:true, vertical:true}}
            menuPosition="right"
            panes={panes}
        />
    )
})