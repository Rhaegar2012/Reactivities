import { createBrowserRouter,Navigate,RouteObject } from "react-router-dom";
import HomePage from '../../features/home/HomePage';
import App from '../../app/layout/App';
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/users/LoginForm";
import ProfilePage from "../../features/profiles/ProfilePage";
import RequireAuth from "./RequireAuth";

export const routes: RouteObject[]=[
    {
        path:'/',
        element:<App/>,
        children:[
            {element:<RequireAuth/>,children:[
                {path:'activities',element:<ActivityDashboard/>},
                {path:'createActivity',element:<ActivityForm key='create'/>},
                {path:'activities/:id',element:<ActivityDetails/>},
                {path:'manage/:id',element:<ActivityForm key='manage'/>},
                {path:'profiles/:username',element:<ProfilePage/>},
                {path:'errors',element:<TestErrors/>},
            ]},
            {path:'', element:<HomePage/>},
            {path:'login',element:<LoginForm/>},
            {path:'not-found',element:<NotFound/>},
            {path:'server-error',element:<ServerError/>},
            {path:'*',element:<Navigate replace to='/not-found'/>}
        ]

    }

]

export const router = createBrowserRouter(routes);