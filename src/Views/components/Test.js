import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header/Header";
import SideMenu from "./SideMenu/SideMenu";
import { AuthContext } from "./Context/AuthProvider";
import { Navigate } from "react-router-dom";

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
    <>
      {/* {isAuthenticated ? ( */}
      <div style={{ height: "200%" }}>
        <Header />
        <SideMenu role={role} />
      </div>
      {/* ) : (
         <Navigate to="/" />
      )} */}
    </>
  );
};

export default Test;
