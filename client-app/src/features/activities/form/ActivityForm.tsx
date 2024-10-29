import LoadingComponent from '../../../app/layout/LoadingComponents';
import {useState,useEffect,ChangeEvent} from 'react';
import {Segment,Button, FormField, Label,Header} from 'semantic-ui-react';
import {useStore} from '../../../app/stores/store';
import { Activity, ActivityFormValues } from '../../../app/models/activity';
import {observer} from 'mobx-react-lite';
import { useNavigate, useParams,Link } from 'react-router-dom';
import {v4 as uuid} from 'uuid';
import { Formik,Form,Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';




export default observer (function ActivityForm(){

    const {activityStore} = useStore();
    const {selectedActivity,createActivity,updateActivity,loading,loadActivities,loadingInitial,loadActivity}=activityStore;
    const {id} = useParams();
    const navigate = useNavigate();
    const [activity,setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchema = Yup.object({
        title:      Yup.string().required('The activity title is required'),
        description:Yup.string().required('The activity description is required'),
        category:   Yup.string().required(),
        venue:      Yup.string().required('The activity venue is required'),
        city:       Yup.string().required('The activity city is required'),
    })

  
    useEffect(()=>{
        if(id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
    },[id,loadActivity])
 
    
    function handleFormSubmit(activity:ActivityFormValues){
       if(!activity.id){
        activity.id=uuid();
        createActivity(activity).then(()=>navigate(`/activities/${activity.id}`))
       } else {
        updateActivity(activity).then(()=>navigate(`/activities/${activity.id}`))
       }
       

    }

   

    if(loadingInitial) return <LoadingComponent content ='Loading activity....'/>


    return(
        <Segment clearing>
            <Header content = 'Activity Details' sub color='teal'/>
            <Formik 
                validationSchema ={validationSchema}
                enableReinitialize 
                initialValues={activity} 
                onSubmit={values=>handleFormSubmit(values)}>
                {({handleSubmit,isValid, isSubmitting, dirty})=>(
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name ='title' placeholder='title'/>
                        <MyTextArea placeholder='description' rows={3} name='description' />
                        <MySelectInput options={categoryOptions} placeholder='category' name='category' />
                        <MyDateInput placeholder='date' name='date'/>
                        <Header content = 'Location Details' sub color='teal'/>
                        <MyTextInput placeholder='city'   name='city' />
                        <MyTextInput placeholder='venue'  name='venue'/>
                        <Button disabled={isSubmitting || !dirty ||!isValid} loading={isSubmitting} floated='right' positive type='submit' content='Submit'/>
                        <Button as={Link} to='/activities' floated='right' type='submit' content='Cancel'/>
                    </Form>
                )}
            </Formik>
        </Segment>
    )

})