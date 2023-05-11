import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../Models/firebase/config";
import { Spin } from "antd";

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((user) => {
      console.log({ user });
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({
          displayName,
          email,
          uid,
          photoURL,
        });
        setIsAuthenticated(true);
        setIsLoading(false);
        // navigate("/homepage");
        // if (email.startsWith("ad")) {
        //   navigate("/homepage", { state: { role: "admin" } });
        //   return;
        // } else if (email.startsWith("tp")) {
        //   navigate("/homepage", { state: { role: "departmenthead" } });
        //   return;
        // }
      }

      setIsLoading(false);
      navigate("/");
    });

    return () => {
      unsubscribed();
    };
  }, [navigate]);
  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {isLoading ? <Spin /> : children}
    </AuthContext.Provider>
  );
}
