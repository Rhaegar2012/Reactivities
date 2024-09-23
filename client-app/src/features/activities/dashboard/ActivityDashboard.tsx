
import {Grid} from 'semantic-ui-react';
import ActivityList  from './ActivityList';
import LoadingComponent from '../../../app/layout/LoadingComponents'
import {useStore} from '../../../app/stores/store'
import {observer} from 'mobx-react-lite';
import { useEffect } from 'react';




export default observer (function ActivityDashboard(){
    const {activityStore} =useStore();
    const {loadActivities,activityRegistry} = activityStore;
    //Loads activity list from API
    useEffect(()=>{
      if(activityRegistry.size <= 1) loadActivities();
    },[loadActivities,activityRegistry.size])
  
    
  
    if (activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>
    return(
            <Grid>
                <Grid.Column width = '10'>
                    <ActivityList 
                    />
                </Grid.Column>
                <Grid.Column width='6'>
                    <h2>Activity filters</h2>
                </Grid.Column>
            </Grid>
    )
})