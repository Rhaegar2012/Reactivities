
import {useEffect} from 'react';
import {Card,Image,Button,Grid} from "semantic-ui-react";
import {useStore} from '../../../app/stores/store'
import {observer} from "mobx-react-lite";
import { useParams,Link } from "react-router-dom";
import LoadingComponent from '../../../app/layout/LoadingComponents';
import ActivityDetailedChat from '../details/ActivityDetailedChat';
import ActivityDetailedHeader from '../details/ActivityDetailedHeader';
import ActivityDetailedInfo from '../details/ActivityDetailedInfo';
import ActivityDetailedSidebar from '../details/ActivityDetailedSidebar';

export default observer (function ActivityDetails(){
    const {activityStore} = useStore();
    const {selectedActivity:activity,loadActivity,loadingInitial,clearSelectedActivity}=activityStore;
    const {id} = useParams();
    useEffect(() => {
        if(id) loadActivity(id);
        return () => clearSelectedActivity();
    },[id,loadActivity])


    if(loadingInitial || !activity) return<LoadingComponent/>;
    return(
       <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo   activity={activity}/>
                <ActivityDetailedChat activityId={activity.id}/>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar activity={activity}/>
            </Grid.Column>
       </Grid>
    )
 

})


