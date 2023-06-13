import React from 'react'
import Header from '../components/Header/Header'
import SideMenu from '../components/SideMenu/SideMenu'

export default function ReportsForPrincipal() {
    return (
        <div className="App-container">
            <Header />
            <div className="App-Content-container">
                <SideMenu />
                <div className="App-Content-Main">
                    Report for principal
                </div>
            </div>
        </div>
    )
}
