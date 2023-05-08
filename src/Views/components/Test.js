import React from 'react'
import './Test.css'
import { Button } from 'antd'
import Header from './Header/Header'
import SideMenu from './SideMenu/SideMenu'

const Test = () => {
  return (
    <div className="App-container">
      <Header/>
      <div className="App-Content-container">
        <SideMenu/>
        <div className="App-Content-Main">
        <div style={{height: "200%"}}>
            Test2
            <Button onClick={()=> window.open('/video', 'blank')}>Click</Button>
         </div>
        </div>
      </div>
    </div>
    
  )
}

export default Test
