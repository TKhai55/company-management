import React from 'react'
import { Menu} from 'antd';
import './SideMenu.css'
import { useNavigate } from 'react-router-dom'

let myArray = [
  { label: 'test 10', key: 'test1', icon: 'SettingOutlined' },
  { label: 'test 2', key: 'test2', icon: 'SettingOutlined' },
  { label: 'test 3', key: 'test3', icon: 'SettingOutlined' },
  // ...
];

const menuItems = myArray.map((obj) => (
  <Menu.Item key={obj.key} icon={React.createElement(obj.icon)}>
    {obj.label}
  </Menu.Item>
));

const SideMenu = ({role}) => {
    const navigate = useNavigate()
    console.log("Role received in SideMenu:", role);
    if (role.includes("admin")) {
      return (
          <Menu
          mode='inline'
          className='SideMenu-container'
          onClick={({key})=>{
            navigate(key)
        }}
        >
          {menuItems}
        </Menu>
  )
    }
}

export default SideMenu
