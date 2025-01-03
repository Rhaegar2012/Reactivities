//import React,
//import {useState,SyntheticEvent} from 'react';
import {Item,Button,Label,Segment,Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {Activity} from '../../../app/models/activity';
//import {useStore} from '../../../app/stores/store';
import {format} from 'date-fns';
import ActivityListItemAttendee from './ActivityListItemAttendee';

interface Props{
    activity:Activity;
}

export default function ActivityListItem({activity}:Props){
    //const {activityStore} = useStore();
    //const {deleteActivity} =activityStore;
    //const [setTarget] = useState('');
    
    /*function handleActivityDelete(e:SyntheticEvent<HTMLButtonElement>,id:string){
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }*/

    return(
        <Segment.Group>
            <Segment>
                {activity.isCancelled && <Label attached='top' color='red' content='Cancelled' style={{textAlign:'center'}}/> }
                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBottom:3}} size='tiny' circular src={activity.host?.image ||'/assets/user.png'}/>
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                            <Item.Description>Hosted by <Link to={`/profiles/${activity.hostUserName}`}></Link> {activity.host?.displayName}</Item.Description>
                            {activity.isHost &&(
                                <Item.Description>
                                    <Label basic color ='orange'>
                                        You are hosting this activity
                                    </Label>
                                </Item.Description>
                            )}
                              {activity.isGoing && !activity.isHost &&(
                                <Item.Description>
                                    <Label basic color ='green'>
                                        You are going this activity
                                    </Label>
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock'/> {format(activity.date!,'dd MMM yyyy h:mm aa')}
                    <Icon name='marker'/>{activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!}/> 
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activities/${activity.id}`} color='teal' floated='right' content='View'/>
             
            </Segment>
        </Segment.Group>
       
       
    )
}