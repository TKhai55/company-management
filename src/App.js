import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Views/Login/Login";
import HomePage from "./Views/components/Test";
import AuthProvider from "./Views/components/Context/AuthProvider";
import Chatbox from "./Views/chat/chatbox";
import JitsiMeet from "./Views/JitsiMeet";
import Test from "./Views/components/Test";
import ManageRole from "./Views/ManageRole/ManageRole";
import CreateRole from "./Views/CreateRole/CreateRole";
import {MenuProvider} from './Controls/SideMenuProvider'

function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <Routes>
          <Route element={<Login/>} path="/" />
          <Route element={<HomePage/>} path="/homepage" />
          <Route element={<Chatbox/>} path="/chatbox" />
          {/* <Route path="/news" element={<News/>} /> */}
          {/* <Route path="/createacc" element={<CreateAccount/>} /> */}
          <Route path="/manageacc" element={<Test/>} />
          <Route path="/createrole" element={<CreateRole/>} />
          <Route path="/managerole" element={<ManageRole/>} />
          <Route path="/video" element={<JitsiMeet/>} />
      </Routes>
      </MenuProvider>
    </AuthProvider>

  );
}

export default App;
