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
        title: Yup.string().required('The activity title is required'),
        description:Yup.string().required('The activity description is required'),
        category:Yup.string().required(),
        dates:Yup.string().required(),
        venue:Yup.string().required(),
        city:Yup.string().required(),
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
                        <MyTextInput name ='title' placeholder='Title'/>
                        <MyTextArea placeholder='Description' rows={3} name='description' />
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <MyDateInput placeholder='Date' name='date'/>
                        <MyTextInput placeholder='City'   name='city' />
                        <MyTextInput placeholder='Venue'  name='venue'/>
                        <Button loading={loading} floated='right' positive type='submit' content='Submit'/>
                        <Button as={Link} to='/activities' floated='right' type='submit' content='Cancel'/>
                    </Form>
                )}
            </Formik>
        </Segment>
    )

})