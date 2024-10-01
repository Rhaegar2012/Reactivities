
import NavBar from './NavBar'
import HomePage from '../../features/home/HomePage'
import {Container} from "semantic-ui-react"
import {observer} from 'mobx-react-lite'
import { Outlet,useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'



function App() {

  const location = useLocation();

  return (
    
    <div>
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
