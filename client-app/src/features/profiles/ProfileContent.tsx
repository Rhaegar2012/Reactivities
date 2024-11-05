import React from 'react';
import {Tab} from 'semantic-ui-react'



export default function ProfileContent(){
    const panes =[
        {menuItem:'About',render:()=>   <Tab>About Content</Tab>},
        {menuItem:'Photos',render:()=>  <Tab>Photos Content</Tab>},
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
}