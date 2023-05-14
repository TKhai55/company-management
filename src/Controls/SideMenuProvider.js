import React from 'react';
import { MenuContext } from '../Views/components/Context/MenuContext';
import SideMenuController from './SideMenuController';

export const MenuProvider = ({ children }) => {
  const items = SideMenuController();

  return (
    <MenuContext.Provider value={items}>
      {children}
    </MenuContext.Provider>
  );
};