import { useEffect, useState } from "react";
import firebase, { db } from "../Models/firebase/config";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

const GetDepartmentPlan = async (department) => {
  const colRef = collection(db, "plan");
  const q = query(colRef, where("department", "==", department));
  const querySnapshot = await getDocs(q);
  const data = [];
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    if (!docData.hasOwnProperty("isDepartmentPlan")) {
      data.push({ id: doc.id, ...docData });
    }
  });
  return data;
};
const EditDepartmentData = async (documentId, newValue) => {
  try {
    const docRef = db.collection("plan").doc(documentId);
    await docRef.update({
      isConfirm: newValue,
    });
    console.log("Document updated successfully");
    return documentId;
  } catch (error) {
    console.error("Error updating document: ", error);
    return null;
  }
};

const GetPlanByTime = async () => {
  const colRef = collection(db, "plan");
  const q = query(colRef, where("isConfirm", "==", true));
  const querySnapshot = await getDocs(q);
  const data = [];
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    if (!docData.hasOwnProperty("isDepartmentPlan")) {
      data.push({ id: doc.id, ...docData });
    }
  });
  return data;
};

const GetPlan = async (department) => {
  const colRef = collection(db, "plan");
  const q = query(colRef, where("department", "==", department));
  const querySnapshot = await getDocs(q);
  const data = [];
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    if (docData.hasOwnProperty("isDepartmentPlan")) {
      data.push({ id: doc.id, ...docData });
    }
  });
  return data;
};
const GetCompanyPlan = async () => {
  const colRef = collection(db, "plan");
  const querySnapshot = await getDocs(colRef);
  const data = [];
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    if (docData.hasOwnProperty("isDepartmentPlan")) {
      data.push({ id: doc.id, ...docData });
    }
  });
  return data;
};
export {
  GetDepartmentPlan,
  EditDepartmentData,
  GetPlanByTime,
  GetPlan,
  GetCompanyPlan,
};
