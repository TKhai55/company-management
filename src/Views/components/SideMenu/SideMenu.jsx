import React from 'react'
import { Menu} from 'antd';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faPager } from '@fortawesome/free-solid-svg-icons';
import './SideMenu.css'

let myArray = [
  {
    key: 'home',
    to: '/',
    label: 'Home',
  },
  {
    key: 'about',
    to: '/test2',
    label: 'About',
  },
  {
    key: 'contact',
    to: '/test3',
    label: 'Contact',
  },
];

myArray.forEach(item => {
  if(item.label ==='Home')
    item.icon = <FontAwesomeIcon icon={faHome}/>
  if(item.label ==='About')
    item.icon = <FontAwesomeIcon icon={faSearch}/>
  if(item.label ==='Contact')
    item.icon = <FontAwesomeIcon icon={faPager}/>
});

console.log(myArray)
const menuItems = myArray.map((obj) => (
  <Menu.Item key={obj.key} icon={obj.icon}>
      <NavLink to={obj.to}>
        {obj.label}
      </NavLink>
  </Menu.Item>
));


const SideMenu = () => {
  return (
        <Menu
        mode='inline'
        className='SideMenu-container'
        >
          {menuItems}
        </Menu>
   
  )
}

export default SideMenu
