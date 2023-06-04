import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../Models/firebase/config";
import { message, Spin } from "antd";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  React.useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged(async (user) => {
      console.log({ user });

      if (user) {
        onSnapshot(doc(db, "users", user.uid), (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            if (userData.isActive) {
              const {
                displayName,
                email,
                uid,
                photoURL,
                department,
                role,
                phoneNumber,
                location,
              } = userData;
              setUser({
                displayName,
                email,
                uid,
                photoURL,
                department,
                role,
                phoneNumber,
                location,
              });
              setIsAuthenticated(true);
              setIsLoading(false);
            } else {
              message.error(
                "Your account is deactived. Please contact the administrator."
              );
              auth.signOut();
            }
          } else {
            message.error(
              "The user that you log in is not exist in our system!"
            );
          }
        });
      } else {
        setIsLoading(false);
        auth.signOut();
        navigate("/");
      }
    });

    return () => {
      unsubscribed();
    };
  }, [navigate]);
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        email,
        setEmail,
        password,
        setPassword,
      }}
    >
      {isLoading ? <Spin /> : children}
    </AuthContext.Provider>
  );
}
