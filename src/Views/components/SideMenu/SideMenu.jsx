import React, { useContext } from 'react';
import { Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import './SideMenu.css';
import { MenuContext } from '../../../Controls/SideMenuProvider'

const SideMenu = () => {
  const {items} = useContext(MenuContext);
  const location = useLocation();
  console.log('Hàm được load lại');

  const menuItems = items.map((obj) => (
    <Menu.Item key={obj.id} icon={obj.icon} className={location.pathname === obj.link ? 'active' : ''}>
      <NavLink to={obj.link} >{obj.label}</NavLink>
    </Menu.Item>
  ));

  return (
    <Menu mode="inline" className="SideMenu-container">
      {menuItems}
    </Menu>
  );
};

export default SideMenu;