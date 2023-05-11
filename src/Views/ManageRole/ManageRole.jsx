import React from 'react'
import Header from '../components/Header/Header'
import SideMenu from '../components/SideMenu/SideMenu'

function ManageRole() {
  return (
    <div className="App-container">
      <Header/>
      <div className="App-Content-container">
        <SideMenu/>
        <div className="App-Content-Main">
        <div style={{height: "200%"}}>
            Manage Role
         </div>
        </div>
      </div>
    </div>
  )
}

export default ManageRole
