import {makeAutoObservable} from "mobx";
import {Activity} from '../models/activity'
import agent from'../api/agent'

export default class ActivityStore{
    
    activities:Activity[]=[];
    selectedActivity: Activity|null=null;
    editMode = false;
    loading  = false;
    loadingInitial = false;
    constructor(){
        makeAutoObservable(this);
    }

    loadActivities = async ()=>{
        this.setLoadingInitial(true);
        try{
            //Gets list of activities from API 
            const activities = await agent.Activities.list();
            //Loops over activity list and mutates state in MobX and push to the array
            activities.forEach((activity:Activity)=>{
            activity.date=activity.date.split('T')[0];
             this.activities.push(activity);
            })
            this.setLoadingInitial(false);
        }catch(error){
            console.log(error);
            this.setLoadingInitial(false);
            
        }
    }

    setLoadingInitial =(state:boolean)=>{
        this.loadingInitial=state;
    }
    
}