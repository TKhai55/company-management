import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header/Header";
import SideMenu from "./SideMenu/SideMenu";
import { AuthContext } from "./Context/AuthProvider";
import { Navigate } from "react-router-dom";
import './Test.css'
import { Button } from 'antd'

const Test = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const role = state && state.role;

  // const { user, isAuthenticated } = useContext(AuthContext);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/");
  //   }
  // }, [isAuthenticated, user, navigate]);

  // console.log("being homepage", { isAuthenticated });

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

export default Test;
