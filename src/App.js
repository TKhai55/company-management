import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Views/Login/Login";
import HomePage from "./Views/Home/Home";
import AuthProvider from "./Views/components/Context/AuthProvider";
import Chatbox from "./Views/chat/chatbox";
import JitsiMeet from "./Views/JitsiMeet";
import ManageRole from "./Views/ManageRole/ManageRole";
import CreateRole from "./Views/CreateRole/CreateRole";
import { MenuProvider } from "./Controls/SideMenuProvider";
import News from "./Views/News/News";
import CreateAccount from "./Views/components/Admin/CreateAccount/CreateAccount";
import ManageAccount from "./Views/components/Admin/ManageAccount/ManageAccount";
import CreateDepartment from "./Views/Create Department/CreateDepartment";
import ManageDepartment from "./Views/Manage Department/ManageDepartment";
import ManageCustomers from "./Views/Manage Customers/ManageCustomers";
import ManageStorage from "./Views/Manage Storage/ManageStorage";
import Test from "./Test";
import Transaction from "./Views/Transaction/Transaction";
function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <Routes>
          <Route element={<Login />} path="/" />
          <Route path="/news" element={<News />} />
          <Route element={<HomePage />} path="/homepage" />
          <Route element={<Chatbox />} path="/chatbox" />
          <Route path="/createacc" element={<CreateAccount />} />
          <Route path="/manageacc" element={<ManageAccount />} />
          <Route path="/createrole" element={<CreateRole />} />
          <Route path="/managerole" element={<ManageRole />} />
          <Route path="/createdepartment" element={<CreateDepartment />} />
          <Route path="/managedepartment" element={<ManageDepartment />} />
          <Route path="/managecustomers" element={<ManageCustomers />} />
          <Route path="/managestorage" element={<ManageStorage />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/video" element={<JitsiMeet />} />
        </Routes>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
