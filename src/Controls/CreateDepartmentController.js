import { useEffect, useState } from "react";
import { db } from "../Models/firebase/config";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

const CreateDepartmentController = () => {
  const colRef = collection(db, "Department");
  const [functions, setFunctions] = useState([]);

  const fetchData = async () => {
    const querySnapshot = await getDocs(colRef);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    setFunctions(data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return functions;
};

const GetUserData = () => {
  const colRef = collection(db, "users");
  const [functions, setFunctions] = useState([]);
  const q = query(colRef, where("role", "==", "Manager"));

  const fetchData = async () => {
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    setFunctions(data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return functions;
};

const CheckUserData = async (docId) => {
  if (docId == null) {
    return true;
  }
  try {
    const docRef = doc(db, "users", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const departmentField = data.department;

      if (departmentField === null) {
        console.log('Field "department" is null');
        return true;
      } else {
        console.log('Field "department" is not null');
        return false;
      }
    } else {
      console.log("Document does not exist!");
      return false;
    }
  } catch (error) {
    console.error("Error retrieving document:", error);
    return false;
  }
};

const AddDepartmentData = async (formValues) => {
  try {
    if (formValues.leader === null) {
      const docRef = await db.collection("Department").add(formValues);

      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    } else {
      const isUserDataValid = await CheckUserData(formValues.leader);
      if (isUserDataValid === false) {
        return null;
      }
      const docRef = await db.collection("Department").add(formValues);
      EditUserData(formValues.leader, docRef.id);
      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};

const EditUserData = async (documentId, newValue) => {
  if (documentId != null) {
    const docRef = db.collection("users").doc(documentId);
    docRef
      .update({
        department: newValue,
      })
      .then(() => {
        console.log("User department updated successfully");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  }
};

const DeleteDepartmentData = async (docId) => {
  try {
    const docRef = db.collection("Department").doc(docId);
    await docRef.delete();
    ChangeUserData(docId);
    console.log("Document Department successfully!");
  } catch (error) {
    console.error("Error Department document: ", error);
    return null;
  }
};

const ChangeUserData = async (docId) => {
  try {
    const collectionRef = db.collection("users");
    const querySnapshot = await collectionRef
      .where("department", "==", docId)
      .get();
    const batch = db.batch();
    querySnapshot.forEach((doc) => {
      batch.set(doc.ref, { department: null }, { merge: true });
    });
    await batch.commit();
    console.log("Document User change successfully!");
  } catch (error) {
    console.error("Error User change document: ", error);
    return null;
  }
};

const ChangeUserMnData = async (docId) => {
  try {
    const collectionRef = db.collection("users");
    const querySnapshot = await collectionRef
      .where("department", "==", docId)
      .where("role", "==", "Manager")
      .get();
    const batch = db.batch();
    querySnapshot.forEach((doc) => {
      batch.set(doc.ref, { department: null }, { merge: true });
    });
    await batch.commit();
    console.log("Document User change successfully!");
  } catch (error) {
    console.error("Error User change document: ", error);
    return null;
  }
};

const EditDepartmentData = async (documentId, newValue1, newValue2) => {
  const isUserDataValid = await CheckUserData(newValue1);
  if (isUserDataValid === false) {
    return false;
  }
  ChangeUserMnData(documentId);
  const docRef = db.collection("Department").doc(documentId);
  docRef
    .update({
      leader: newValue1,
      leadermail: newValue2,
    })
    .then(() => {
      EditUserData(newValue1, documentId);
      console.log("Document Department Edit updated successfully");
      return true;
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
      return false;
    });
};

export {
  GetUserData,
  AddDepartmentData,
  DeleteDepartmentData,
  EditDepartmentData,
};

export default CreateDepartmentController;
