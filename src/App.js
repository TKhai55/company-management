import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Views/Login/Login";
import HomePage from "./Views/components/Test";
import AuthProvider from "./Views/components/Context/AuthProvider";
import Chatbox from "./Views/chat/chatbox";
import JitsiMeet from "./Views/JitsiMeet";
import Test from "./Views/components/Test";
import ManageRole from "./Views/ManageRole/ManageRole";


const islogin = true;

function App() {
  if(islogin === false) return(
    <Routes>
      <Route path="/signin" element={<Login/>} />
    </Routes>
  ) 
  else 
  return (

        <Routes>
          {/* <Route Component={Login} path="/" />
          <Route Component={HomePage} path="/homepage" />
          <Route Component={Chatbox} path="/chatbox" /> */}
          <Route path="/" element={<Test/>} />
          <Route path="/createacc" element={<Test/>} />
          <Route path="/manageacc" element={<Test/>} />
          <Route path="/createrole" element={<Test/>} />
          <Route path="/managerole" element={<ManageRole/>} />
          <Route path="/video" element={<JitsiMeet/>} />
      </Routes>
  );
}

export default App;
