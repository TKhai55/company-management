import React from "react";
import "./Login.css";
import logo from "./../../images/main logo.png";
import {BsArrowRight} from "react-icons/bs"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase, {auth} from "../../Models/firebase/config"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.email.startsWith("ad")) {
          navigate("/homepage", { state: { role: "admin" } })
        }
        else if (user.email.startsWith("tp")) {
          navigate("/homepage", { state: { role: "departmenthead" } })
        }
        return
      })
      .catch((error) => {
        const errorMessage = error.message;
 
        console.log({errorMessage})
      });
  }
  return (
    <div id="register-form-wrapper">
      <div id="register-form-background">
        <div id="register-form-logo">
          <img src={logo} alt="" />
        </div>

        <div id="register-form-input-details">
          <div id="register-form-header">Welcome to SYNERPRISE system</div>
          <div id="register-form-details">Please sign in to access to your workplace.</div>
          <div id="register-form-user-pass-wrapper">
            <div className="register-form-input">
              <label htmlFor="username" style={{ fontSize: "15px" }}>Username</label>
              <input
                type="text"
                name="username"
                className="register-form-input-component"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="register-form-input">
              <label htmlFor="password" style={{ fontSize: "15px" }}>Password</label>
              <input
                type="text"
                name="password"
                className="register-form-input-component"
                onChange={(e) => setPassword(e.target.value)}

              />
            </div>
          <div className="register-form-input">
              <button 
              className="register-form-input-component register-form-create-account-button"
              onClick={handleSignIn}
              >
                Sign in
                <BsArrowRight/>
              </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
