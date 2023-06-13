import React, { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import SideMenu from '../components/SideMenu/SideMenu'

//doanh so 2 dang: nhap, xuat
//ti le nhan vien dat kpi


export default function ReportsForManager() {


    return (
        <div className="App-container">
            <Header />
            <div className="App-Content-container">
                <SideMenu />
                <div className="App-Content-Main">
                    Report for managers
                </div>
            </div>
        </div>
    )
}
