import axios, {AxiosResponse}from 'axios';

axios.defaults.baseURL ='http://localhost:5000/api';
const responseBody = <T> (response:AxiosResponse<T>) =>response.data;
const request ={
    get:(url:string)=>axios.get(url).then(responseBody),
    post:(url:string,body:{})=>axios.post(url).then(responseBody),
    put:(url:string, body:{})=>axios.put(url).then(responseBody),
    del:(url:string)=>axios.delete(url).then(responseBody)
}

const Activities ={
    list: ()=> request.get("/activities")
}

const agent ={
    Activities
}

export default agent;
