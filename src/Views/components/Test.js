import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header/Header";
import SideMenu from "./SideMenu/SideMenu";
import { AuthContext } from "./Context/AuthProvider";
import { Navigate } from "react-router-dom";
import "./Test.css";
import { Button } from "antd";
import { MenuProvider } from "../../Controls/SideMenuProvider";

const Test = () => {
  const { state } = useLocation();
  const role = state && state.role;

  console.log({ role });

  return (
    // <MenuProvider>
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu role={role} />
        <div className="App-Content-Main">
          <div>
            Test2
            <Button onClick={() => window.open("/video", "blank")}>
              Click
            </Button>
          </div>
        </div>
      </div>
    </div>
    // </MenuProvider>
  );
};

export default Test;
