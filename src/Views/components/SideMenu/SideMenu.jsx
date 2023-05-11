import React from 'react'
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import './SideMenu.css';
import SideMenuController from '../../../Controls/SideMenuController';

const SideMenu = () => {
  const functions = SideMenuController()
  console.log(functions)

  const menuItems = functions.map((obj) => (
    <Menu.Item key={obj.id} icon={obj.icon}>
      <NavLink to={obj.link}>{obj.label}</NavLink>
    </Menu.Item>
  ));

  return (
    <Menu mode="inline" className="SideMenu-container">
      {menuItems}
    </Menu>
  );
};

export default SideMenu;
