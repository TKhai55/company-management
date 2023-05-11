import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Views/Login/Login";
import HomePage from "./Views/components/Test";
import AuthProvider from "./Views/components/Context/AuthProvider";
import Chatbox from "./Views/chat/chatbox";

function App() {
  return (
    // <AuthProvider>
    <Routes>
      <Route Component={Login} path="/" />
      <Route Component={HomePage} path="/homepage" />
      <Route Component={Chatbox} path="/chatbox" />
    </Routes>
    //</AuthProvider>
  );
}

export default App;
