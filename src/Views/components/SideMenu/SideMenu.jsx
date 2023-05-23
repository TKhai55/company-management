import React, { useContext, useState, useEffect } from "react";
import { Menu, Spin } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import "./SideMenu.css";
import { MenuContext } from "../../../Controls/SideMenuProvider";

const SideMenu = () => {
  const { items } = useContext(MenuContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  // const [firstTime, setFirstLoad] = useState(true);
  const { updateLoad } = useContext(MenuContext);
  const { firstLoad } = useContext(MenuContext);

  useEffect(() => {
    if (firstLoad) {
      fetchData();
    } else {
      setLoading(false);
      updateLoad(false);
    }
  }, []);

  const fetchData = async () => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
      updateLoad(false);
    }, 1500);
  };

  const menuItems = items.map((obj) => (
    <Menu.Item
      key={obj.id}
      icon={obj.icon}
      className={location.pathname === obj.link ? "active" : ""}
    >
      <NavLink to={obj.link}>{obj.label}</NavLink>
    </Menu.Item>
  ));

  return (
    <Menu
      mode="inline"
      className="SideMenu-container"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {loading && firstLoad ? (
        <Spin
          size="large"
          style={{ alignSelf: "center", justifySelf: "flex-end" }}
        />
      ) : (
        menuItems
      )}
    </Menu>
  );
};

export default SideMenu;
