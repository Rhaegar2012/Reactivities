import React from 'react';
import {Grid,Item,Header,Segment,Statistic,Divider,Reveal,Button} from 'semantic-ui-react';
export default function ProfileHeader(){
    return(
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item.Image avatar size="small" src={'/assets/user.png'}/>
                        <Item.Content verticalAlign ='middle'>
                            <Header as='h1' content='Displayname'/>
                        </Item.Content>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group widths ={2}>
                        <Statistic label='Followers' value='5'/>
                        <Statistic label='Followers' value='42'/>
                    </Statistic.Group>
                    <Divider/>
                    <Reveal animated='move'>
                        <Reveal.Content visible style={{width:'100%'}}>
                            <Button fluid  basic color={true ? 'red':'green'} content={true? 'Unfollow' :'Follow'}/>
                        </Reveal.Content>
                    </Reveal>
                </Grid.Column>
            </Grid>
        </Segment>
    )
}