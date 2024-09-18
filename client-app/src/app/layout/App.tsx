
import NavBar from './NavBar'
import {Container} from "semantic-ui-react"
import {observer} from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'



function App() {

  return (
    <div>
      <NavBar></NavBar>
      <Container style={{marginTop:'7em'}}>
       <Outlet/>
      </Container>
    </div>
  )
}

export default observer( App)
