
import React, { useState, useEffect } from 'react';
import { db } from '../Models/firebase/config';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faUsers,
  faUserGear,
  faUsersGear,
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons';

const SideMenuController = (roleID) => {
  const q = query(collection(db, 'RoleFunction'), where('role', '==', roleID));
  const colRef = collection(db, 'Functions');
  const [rolefunctions, setRoleFunctions] = useState([]);
  const fetchData = async () => {
    try {
      const [rolefunctionsSnapshot, functionsSnapshot] = await Promise.all([
        getDocs(q),
        getDocs(colRef),
      ]);

      const rolefunctionsData = rolefunctionsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const functionsData = functionsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        icon: getIconByLabel(doc.data().label),
      }));

      combinationArray(rolefunctionsData, functionsData);
      setRoleFunctions(rolefunctionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roleID]);

  const combinationArray = (rolefunctionsData, functionsData) => {
    const functionMap = new Map();

    functionsData.forEach((func) => {
      functionMap.set(func.label, {
        label: func.label,
        link: func.link,
        icon: func.icon,
      });
    });

    rolefunctionsData.forEach((rf) => {
      const func = functionMap.get(rf.function);
      if (func) {
        rf.label = func.label;
        rf.link = func.link;
        rf.icon = func.icon;
      }
    });
  };

  const getIconByLabel = (label) => {
    if (label === 'News') return <FontAwesomeIcon icon={faNewspaper} />;
    if (label === 'Create Account') return <FontAwesomeIcon icon={faUser} />;
    if (label === 'Create Role') return <FontAwesomeIcon icon={faUserGear} />;
    if (label === 'Manage Account') return <FontAwesomeIcon icon={faUsers} />;
    if (label === 'Manage Role') return <FontAwesomeIcon icon={faUsersGear} />;
    return null;
  };

  return rolefunctions.sort((a, b) => a.stt - b.stt);
};

export default SideMenuController;
