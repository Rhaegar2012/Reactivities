
import NavBar from './NavBar'
import HomePage from '../../features/home/HomePage'
import {Container} from "semantic-ui-react"
import {observer} from 'mobx-react-lite'
import { Outlet,ScrollRestoration,useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useStore } from '../stores/store'
import { useEffect } from 'react'
import LoadingComponent from './LoadingComponents'
import ModalContainer from '../common/modals/ModalContainer'



function App() {

  const location = useLocation();
  const {commonStore,userStore} = useStore();

  useEffect(()=>{
    if(commonStore.token){
      userStore.getUser().finally(()=>commonStore.setAppLoaded())
    }else{
      commonStore.setAppLoaded()
    }
  },[commonStore,useStore])

  if(!commonStore.appLoaded) return <LoadingComponent content ='Loading app...'/>

  return (
    
    <div>
      <ScrollRestoration/>
      <ModalContainer/>
      <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
      {location.pathname==='/'?<HomePage/>:(
        <>
         <NavBar></NavBar>
          <Container style={{marginTop:'7em'}}>
          <Outlet/>
          </Container>
        </>
      )}
     
    </div>
  )
}

export default observer( App)
