import React from "react";
import "./Login.css";
import logo from "./../../images/main logo.png";
import { BsArrowRight } from "react-icons/bs";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase, { auth, db } from "../../Models/firebase/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../components/Context/AuthProvider";
import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import CreateAccount from "../components/Admin/CreateAccount/CreateAccount";
import { MenuContext } from "../../Controls/SideMenuProvider";
import { message } from "antd";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  // const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")
  const [roleArray, setRoleArray] = useState([]);
  const { email, password, setEmail, setPassword } = useContext(AuthContext);
  const { updateRoleID } = useContext(MenuContext);

  useEffect(() => {
    (async () => {
      const collectionRef = collection(db, "Role");
      const snapshots = await getDocs(collectionRef);
      const docs = snapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;

        return data;
      });
      setRoleArray(docs);
    })();
  }, []);

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        roleArray.forEach((role) => {
          if (role.key === user.email.slice(0, 2) && isAuthenticated) {
            updateRoleID(role.id)
            navigate("/homepage", { state: { role: role.id } })
          }
        });
        return;
      })
      .catch((error) => {
        const errorMessage = error.message;
        message.error(errorMessage);
      });
  };
  return (
    <div id="register-form-wrapper">
      <div id="register-form-background">
        <div id="register-form-logo">
          <img src={logo} alt="" />
        </div>

        <div id="register-form-input-details">
          <div id="register-form-header">Welcome to SYNERPRISE system</div>
          <div id="register-form-details">
            Please sign in to access to your workplace.
          </div>
          <div id="register-form-user-pass-wrapper">
            <div className="register-form-input">
              <label htmlFor="username" style={{ fontSize: "15px" }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                className="register-form-input-component"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="register-form-input">
              <label htmlFor="password" style={{ fontSize: "15px" }}>
                Password
              </label>
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
                <BsArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
