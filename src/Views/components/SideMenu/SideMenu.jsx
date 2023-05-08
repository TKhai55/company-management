import React from 'react'
import { Menu} from 'antd';
import './SideMenu.css'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faPager } from '@fortawesome/free-solid-svg-icons';

let myArray = [
  { label: 'test 10', key: ''},
  { label: 'test 2', key: 'test2' },
  { label: 'test 3', key: 'test3'},
  // ...
];
myArray.forEach(item => {
  if(item.label ==='test 10')
    item.icon = <FontAwesomeIcon icon={faHome}/>
  if(item.label ==='test 2')
    item.icon = <FontAwesomeIcon icon={faSearch}/>
  if(item.label ==='test 3')
    item.icon = <FontAwesomeIcon icon={faPager}/>
});

console.log(myArray)
const menuItems = myArray.map((obj) => (
  <Menu.Item key={obj.key} icon={obj.icon}>
    {obj.label}
  </Menu.Item>
));


const SideMenu = () => {
    const navigate = useNavigate()
  return (
        <Menu
        mode='inline'
        className='SideMenu-container'
        onClick={({key})=>{
          navigate(key)
        }}>
          {menuItems}
        </Menu>
   
  )
}

export default SideMenu
