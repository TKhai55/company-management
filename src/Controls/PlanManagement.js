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

const GetPlan = async (uid) => {
  const colRef = collection(db, "plan");
  const q = query(colRef, where("employeeID", "==", uid));
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

const DeletePlanData = async (docId) => {
  try {
    const docRef = db.collection("plan").doc(docId);
    await docRef.delete();
    console.log("Document deleted successfully!");
  } catch (error) {
    console.error("Error deleting document: ", error);
    return null;
  }
};

const GetPlanByID = async (planID) => {
  const colRef = collection(db, "plan");
  const docRef = doc(colRef, planID);
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists()) {
    const planData = { id: docSnapshot.id, ...docSnapshot.data() };
    return planData;
  } else {
    return null; // Không tìm thấy plan với ID tương ứng
  }
};
const EditPlanData = async (documentId, formValue) => {
  const docRef = db.collection("plan").doc(documentId);
  docRef
    .update({
      title: formValue.title,
      start: formValue.start,
      end: formValue.end,
      planDetails: formValue.planDetails,
      participants: formValue.participants,
    })
    .then(() => {
      console.log("Document updated successfully");
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
};
export { GetPlan, DeletePlanData, GetPlanByID, EditPlanData };
