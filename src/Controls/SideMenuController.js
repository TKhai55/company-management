import React, { useState, useEffect } from 'react';
import {db} from '../Models/firebase/config'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faUserGear, faUsersGear, faNewspaper } from '@fortawesome/free-solid-svg-icons';

const SideMenuController = () => {
  const key = '4nyDFcYo2Ulai5BMKc39'

  const q = query(collection(db, "RoleFunction"), where("role", "==", key));
  const colRef = collection(db, "Functions");
  const [rolefunctions, setRoleFunctions] = useState([]);

  const fetchData = async () => {
    // lần lượt đọc lấy dữ liệu từ 2 collection vào 2 mảng
    const [rolefunctionsSnapshot, functionsSnapshot] = await Promise.all([
      getDocs(q),
      getDocs(colRef),
    ]);
    // tạo mảng rolefunctionsData
    const rolefunctionsData = rolefunctionsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    // tạo mảng functionsData
    const functionsData = functionsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      icon: getIconByLabel(doc.data().label),
    }));
    combinationArray(rolefunctionsData, functionsData);
    setRoleFunctions(rolefunctionsData);
  };

  const combinationArray = (rolefunctionsData, functionsData) => {
    const functionMap = new Map();
    // tạo mảng con chứ các thông tin từ Functions
    functionsData.forEach((func) => {
      functionMap.set(func.label, {
        label: func.label,
        link: func.link,
        icon: func.icon,
      });
    });

    //dùng mảng con đã tạo để kết hợp với mảng chính từ RoleFunctions
    rolefunctionsData.forEach((rf) => {
      const func = functionMap.get(rf.function);
      if (func) {
        rf.label = func.label;
        rf.link = func.link;
        rf.icon = func.icon;
      }
    });
  };

  // tạo icon cho mỗi tab screen
  const getIconByLabel = (label) => {
    if (label === 'News') return <FontAwesomeIcon icon={faNewspaper} />;
    if (label === 'Create Account') return <FontAwesomeIcon icon={faUser} />;
    if (label === 'Create Role') return <FontAwesomeIcon icon={faUserGear} />;
    if (label === 'Manage Account') return <FontAwesomeIcon icon={faUsers} />;
    if (label === 'Manage Role') return <FontAwesomeIcon icon={faUsersGear} />;
    return null;
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  // trả về mảng được sort theo số thứ tự xuất hiện
  return rolefunctions.sort((a, b) => a.stt - b.stt);
};

export default SideMenuController;
