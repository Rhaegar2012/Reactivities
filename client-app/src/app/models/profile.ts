//import { StrictSegmentInlineProps } from 'semantic-ui-react';
import {User} from './user';

export interface IProfile{
    username:string;
    displayName: string;
    image?:string;
    bio?:string;
    followersCount: number;
    followingCount: number;
    following:boolean;
    photos?:Photo[]
}

export class Profile implements IProfile{
    photos: any;
    constructor(user: User){
        this.username = user.username;
        this.displayName = user.displayname;
        this.image = user.image;
    }
    username:string;
    displayName: string;
    image?:string;
    bio?:string;
    followersCount=0;
    followingCount=0;
    following=false;
    
}

export interface Photo{
    id:string;
    url:string;
    isMain:boolean;
    photos?:Photo[]
}

export interface UserActivity{
    id:string;
    title:string;
    category:string;
    date:Date;
}