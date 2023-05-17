import React from 'react';
import { MenuContext } from '../Views/components/Context/MenuContext';
import SideMenuController from './SideMenuController';

export const MenuProvider = ({ children }) => {
  // const items = [
  //   {
  //     label: 'News',
  //     link: '/',
  //   },
  //   {
  //     label: 'Create Account',
  //     link: '/createacc',
  //   },
  //   {
  //     label: 'Manage Account',
  //     link: '/manageacc',
  //   },
  //   {
  //     label: 'Create Role',
  //     link: '/createrole',
  //   },
  //   {
  //     label: 'Manage Role',
  //     link: '/managerole',
  //   },
  // ]

    const items = SideMenuController()
  return (
    <MenuContext.Provider value={items}>
      {children}
    </MenuContext.Provider>
  );
};