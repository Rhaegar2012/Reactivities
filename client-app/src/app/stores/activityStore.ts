import {makeAutoObservable, runInAction} from "mobx";
import {Activity} from '../models/activity'
import agent from'../api/agent'
import {v4 as uuid} from 'uuid'

export default class ActivityStore{
    
    activities:Activity[]=[];
    selectedActivity: Activity|undefined=undefined;
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

    selectActivity=(id:string)=>{
        this.selectedActivity = this.activities.find(a=>a.id===id)
    }

    cancelSelectedActivity=()=>{
        this.selectedActivity = undefined;
    }

    openForm=(id?:string)=>{
        id?this.selectActivity(id):this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm=()=>{
        this.editMode = false;
    }

    createActivity = async( activity:Activity)=>{
        this.loading=true;
        activity.id=uuid()
        try{
            await agent.Activities.create(activity);
            runInAction(()=>{
                this.activities.push(activity);
                this.selectedActivity=activity;
                this.editMode = false;
                this.loading = false;
            })
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loading = false;
            })
        }
    }

    updateActivity = async(activity:Activity)=>{
        this.loading = true;
        try{
            await agent.Activities.update(activity);
            runInAction(()=>{
                //Creates new array and replaces current activities array
                this.activities=[...this.activities.filter(a=>a.id !== activity.id)];
                this.selectedActivity = activity;
                this.editMode= false;
                this.loading = false;
            })
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loading=false;
            })
        }
    }

    deleteActivity = async(id:string)=>{
        this.loading = true;
        try{
            await agent.Activities.delete(id);
            runInAction(()=>{
                this.activities=[...this.activities.filter(a=>a.id !== id)];
                if(this.selectedActivity?.id === id) this.cancelSelectedActivity;
                this.loading = false;
            })

        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loading=false;
            })
        }
    }


    
}