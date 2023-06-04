import { useEffect, useState } from "react";
import { db } from "../Models/firebase/config";
import { getDocs, collection } from "firebase/firestore";

const CustomersController = () => {
  const colRef = collection(db, "customers");
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
const AddCustomerData = async (formValues) => {
  console.log(formValues);
  try {
    const docRef = await db.collection("customers").add(formValues);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};
const DeleteCustomerData = async (docId) => {
  try {
    const docRef = db.collection("customers").doc(docId);
    await docRef.delete();
    console.log("Document deleted successfully!");
  } catch (error) {
    console.error("Error deleting document: ", error);
    return null;
  }
};

const EditCustomerData = async (documentId, formValues) => {
  const docRef = db.collection("customers").doc(documentId);
  docRef
    .update({
      name: formValues.name,
      diachi: formValues.diachi,
      sdt: formValues.sdt,
      email: formValues.email,
      type: formValues.type,
      priority: formValues.priority,
    })
    .then(() => {
      console.log("Document updated successfully");
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
};
export { AddCustomerData, DeleteCustomerData, EditCustomerData };
export default CustomersController;
