import LoadingComponent from '../../../app/layout/LoadingComponents';
import {useState,useEffect,ChangeEvent} from 'react';
import {Segment,Button, FormField, Label} from 'semantic-ui-react';
import {useStore} from '../../../app/stores/store';
import { Activity } from '../../../app/models/activity';
import {observer} from 'mobx-react-lite';
import { useNavigate, useParams,Link } from 'react-router-dom';
import {v4 as uuid} from 'uuid';
import { Formik,Form,Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';




export default observer (function ActivityForm(){

    const {activityStore} = useStore();
    const {selectedActivity,createActivity,updateActivity,loading,loadActivities,loadingInitial,loadActivity}=activityStore;
    const {id} = useParams();
    const navigate = useNavigate();
    const [activity,setActivity] = useState<Activity>({
        id:'',
        title:'',
        category:'',
        description:'',
        date:'',
        city:'',
        venue:''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required')
    })

    useEffect(()=>{
        if(id) loadActivity(id).then(activity => setActivity(activity!))
    },[id,loadActivity])
 
    
    /*function handleSubmit(){
       if(!activity.id){
        activity.id=uuid();
        createActivity(activity).then(()=>navigate(`/activities/${activity.id}`))
       } else {
        updateActivity(activity).then(()=>navigate(`/activities/${activity.id}`))
       }
       

    }

    function handleInputChange(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
        const {name,value} = event.target;
        setActivity({...activity,[name]:value});

    }*/

    if(loadingInitial) return <LoadingComponent content ='Loading activity....'/>


    return(
        <Segment clearing>
            <Formik 
                validationSchema ={validationSchema}
                enableReinitialize 
                initialValues={activity} 
                onSubmit={values=>console.log(values)}>
                {({handleSubmit})=>(
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <FormField>
                            <Field placeholder='Title'  name='title'/>
                            <ErrorMessage name='title'  render={error=><Label basic color='red' content={error}/>}/>
                        </FormField>
                      
                        <Field placeholder='Description'   name='description' />
                        <Field placeholder='Category'   name='category' />
                        <Field type="date" placeholder='Date'   name='date' />
                        <Field placeholder='City'   name='city' />
                        <Field placeholder='Venue'  name='venue'/>
                        <Button loading={loading} floated='right' positive type='submit' content='Submit'/>
                        <Button as={Link} to='/activities' floated='right' type='submit' content='Cancel'/>
                    </Form>
                )}
            </Formik>
        
        </Segment>
    )

})