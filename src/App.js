import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Views/Login/Login";
import HomePage from "./Views/components/Test";
import AuthProvider from "./Views/components/Context/AuthProvider";
import Chatbox from "./Views/chat/chatbox";
import JitsiMeet from "./Views/JitsiMeet";
import Test from "./Views/components/Test";
import ManageRole from "./Views/ManageRole/ManageRole";
import CreateAccount from "./Views/components/Admin/CreateAccount/CreateAccount";
import CreateRole from "./Views/CreateRole/CreateRole";
import {MenuProvider} from './Controls/SideMenuProvider'

function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/chatbox" element={<Chatbox />} />
          <Route path="/createacc" element={<CreateAccount />} />
          <Route path="/manageacc" element={<Test />} />
          <Route path="/createrole" element={<Test />} />
          <Route path="/managerole" element={<ManageRole />} />
          <Route path="/video" element={<JitsiMeet />} />
        </Routes>
      </MenuProvider>
    </AuthProvider>

  );
}

export default App;
