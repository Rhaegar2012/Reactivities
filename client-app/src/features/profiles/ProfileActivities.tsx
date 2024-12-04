import React, {SyntheticEvent, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Tab,Grid,Header,Card,Image,TabProps} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {UserActivity} from '../../app/models/profile';
import { format } from 'date-fns/format';
import {useStore} from "../../app/stores/store";

const panes=[
    {menuItem:'Future Events', pane:{key:'future'}},
    {menuItem:'Past Events',pane:{key:'past'}},
    {menuItem:'Hosting',pane:{key:'hosting'}}
];


export default observer(function ProfileActivities(){

    const {profileStore} = useStore();
    const{
        loadUserActivities,
        profile,
        loadingActivities,
        userActivities
    } = profileStore;

    useEffect(()=>{
        loadUserActivities(profile!.username);
    },[loadUserActivities,profile]);

    const handleTabChange =(e:SyntheticEvent, data:TabProps)=>{
        loadUserActivities(profile!.username,panes[data.activeIndex as number].pane.key);
    }

    return(
        <Tab loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar' content={'Activities'}/>
                </Grid.Column>
                <Grid.Column width={16}>
                    
                </Grid.Column>
            </Grid>
        </Tab>

    )



})