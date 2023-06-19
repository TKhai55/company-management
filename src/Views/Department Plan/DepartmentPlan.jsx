import React from "react";
import "./DepartmentPlan.css";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import { Empty, Tabs } from "antd";
import EmployeePlan from "./EmployeePlan";
import { useContext } from "react";
import { AuthContext } from "../components/Context/AuthProvider";
import CreateDepartmentPlan from "./CreateDepartmentPlan";
import ManageDepartmentPlan from "./ManageDepartmentPlan";
import { useState } from "react";
const DepartmentPlan = () => {
  const { TabPane } = Tabs;
  const {
    user: { department },
  } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const items = [
    {
      key: "1",
      label: `Employee Plan`,
      children: <EmployeePlan key="1" />,
    },
    {
      key: "2",
      label: `Create Department Plan`,
      children: <CreateDepartmentPlan key="2" />,
    },
    {
      key: "3",
      label: `Manage Department Plan`,
      children: <ManageDepartmentPlan key="3" />,
    },
  ];

  const renderComponent = () => {
    const selectedTab = items.find((item) => item.key === activeTab);
    if (selectedTab) {
      return selectedTab.children;
    }
    return null;
  };
  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div className="App-Content-Main">
          <div className="DepartmentPlan-container">
            <div className="Tabs-container">
              {department ? (
                <Tabs activeKey={activeTab} onChange={handleTabChange}>
                  {items.map((item) => (
                    <TabPane tab={item.label} key={item.key}>
                      {renderComponent()}
                    </TabPane>
                  ))}
                </Tabs>
              ) : (
                <div style={{ height: "80%" }}>
                  <Empty />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentPlan;
