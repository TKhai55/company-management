import { useEffect, useState } from "react";
import { db } from "../Models/firebase/config";
import { getDocs, collection, query, where } from "firebase/firestore";
const StorageController = () => {
  const colRef = collection(db, "products");
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
const AddStorageData = async (formValues) => {
  console.log(formValues);
  try {
    const docRef = await db.collection("products").add(formValues);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};
const DeleteStorageData = async (docId) => {
  try {
    const docRef = db.collection("products").doc(docId);
    await docRef.delete();
    console.log("Document deleted successfully!");
  } catch (error) {
    console.error("Error deleting document: ", error);
    return null;
  }
};

const EditStorageData = async (documentId, newValue) => {
  const docRef = db.collection("products").doc(documentId);
  docRef
    .update({
      giaban: newValue,
    })
    .then(() => {
      console.log("Document updated successfully");
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
};
const GetTransitonData = (productID) => {
  const colRef = collection(db, "transition");
  const [functions, setFunctions] = useState([]);
  const q = query(colRef, where("productId", "==", productID));

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
export { AddStorageData, DeleteStorageData, EditStorageData, GetTransitonData };
export default StorageController;
