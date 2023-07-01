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
import NewsDetails from "./Views/News/NewsDetail/NewsDetails";
import ManageCustomers from "./Views/Manage Customers/ManageCustomers";
import ManageStorage from "./Views/Manage Storage/ManageStorage";
import Transaction from "./Views/Transaction/Transaction";
import MakePlan from "./Views/Make Plan/MakePlan";
import MyPosts from "./Views/components/Header/MyPosts/MyPosts";
import PlanManagement from "./Views/Plan Management/PlanManagement";
import EditPlan from "./Views/Plan Management/EditPlan";
import DepartmentPlan from "./Views/Department Plan/DepartmentPlan";
import CompanyPlan from "./Views/Company Plan/CompanyPlan";
import ReportsForManager from "./Views/Reports/ReportsForManager/ReportsForManager";
import ReportsForPrincipal from "./Views/Reports/ReportsForPrincipal/ReportsForPrincipal";
import MyInsights from "./Views/components/Header/MyInsights/MyInsights";
import CalendarItem from "./Views/Calendar/CalendarItem";

function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:newsID" element={<NewsDetails />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/chatbox" element={<Chatbox />} />
          <Route path="/createacc" element={<CreateAccount />} />
          <Route path="/manageacc" element={<ManageAccount />} />
          <Route path="/createrole" element={<CreateRole />} />
          <Route path="/managerole" element={<ManageRole />} />
          <Route path="/createdepartment" element={<CreateDepartment />} />
          <Route path="/managedepartment" element={<ManageDepartment />} />
          <Route path="/managecustomers" element={<ManageCustomers />} />
          <Route path="/managestorage" element={<ManageStorage />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/makeplan" element={<MakePlan />} />
          <Route path="/planmanagement" element={<PlanManagement />} />
          <Route path="/planmanagement/:planID" element={<EditPlan />} />
          <Route path="/departmentplan" element={<DepartmentPlan />} />
          <Route path="/companyplan" element={<CompanyPlan />} />
          <Route path="/video" element={<JitsiMeet />} />
          <Route
            path="/reportformanager/:idDepartment"
            element={<ReportsForManager />}
          />
          <Route path="/reportforprincipal" element={<ReportsForPrincipal />} />
          <Route path="/myinsights" element={<MyInsights />} />
          <Route path="/calendar" element={<CalendarItem />} />
        </Routes>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
