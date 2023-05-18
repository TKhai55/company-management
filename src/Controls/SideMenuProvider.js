

import React, { createContext, useState, useEffect } from 'react';
import SideMenuController from './SideMenuController';

export const MenuContext = createContext({
  items: [],
  roleID: '',
});

export const MenuProvider = ({ children }) => {
  const [roleID, setRoleID] = useState('');

  const updateRoleID = (id) => {
    setRoleID(id);
    localStorage.setItem('roleID', id); // Lưu giá trị roleID vào localStorage
  };

  const items = SideMenuController(roleID);

  useEffect(() => {
    // Kiểm tra nếu đã có giá trị roleID trong localStorage, khôi phục nó
    const savedRoleID = localStorage.getItem('roleID');
    if (savedRoleID) {
      setRoleID(savedRoleID);
    }
  }, []);

  useEffect(() => {
    // Mỗi khi roleID thay đổi, lưu giá trị mới vào localStorage
    localStorage.setItem('roleID', roleID);
  }, [roleID]);

  return (
    <MenuContext.Provider value={{ items, roleID, updateRoleID }}>
      {children}
    </MenuContext.Provider>
  );
};
