import React from "react";
import "./Login.css";
import { FcGoogle } from "react-icons/fc";
import logo from "./../../images/main logo.png";

const Login = () => {
  return (
    <div className="large-div">
      <div className="Login-Wrapper">
        <div className="Right-Screen">
          <div className="main-content">
            <h1>Welcome back</h1>
            <p>Welcome back! Please enter your details.</p>
            <form>
              <label>Account</label>
              <input type="text" name="name" />
              <label>Password</label>
              <input type="text" name="name" />
            </form>
            <div className="check-forgot">
              <label>
                <input type="checkbox" />
                Remember for 30 days
              </label>
              <a href="#!">Forgot Password</a>
            </div>
            <button className="signin-btn">Sign in</button>
            <button className="gg-btn">
              <FcGoogle className="icon-btn" />
              <span className="btn-text">Sign in with Google</span>
            </button>
            <p className="last-line">
              Don't have an account? <a href="#!">Sign Up</a>
            </p>
          </div>
        </div>
        <div className="Left-Screen">
          <img src={logo} alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default Login;
