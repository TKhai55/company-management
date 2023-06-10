import { useEffect, useState } from "react";
import firebase, { db } from "../Models/firebase/config";
import { getDocs, collection, query, where } from "firebase/firestore";

const GetEmployee = () => {
  const colRef = collection(db, "users");
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
const AddPlanData = async (formValues) => {
  try {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    const docData = {
      ...formValues,
      createDate: timestamp,
    };
    const docRef = await db.collection("plan").add(docData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};
export { GetEmployee, AddPlanData };
