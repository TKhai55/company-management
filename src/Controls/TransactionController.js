import { useEffect, useState } from "react";
import firebase, { db } from "../Models/firebase/config";
import { getDocs, collection, query, where } from "firebase/firestore";
const GetEmployee = () => {
  const colRef = collection(db, "users");
  const [functions, setFunctions] = useState([]);
  const q = query(colRef, where("role", "in", ["Manager", "Employee"]));

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

const GetCustomer = () => {
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
const GetProduct = async () => {
  const colRef = collection(db, "products");

  const querySnapshot = await getDocs(colRef);
  const data = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });

  return data;
};

const AddTransactionData = async (formValues) => {
  try {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    const docData = {
      ...formValues,
      date: timestamp,
    };

    const docRef = await db.collection("transition").add(docData);
    console.log("Document written with ID: ", docRef.id);

    // Update product quantity
    await updateProductQuantity(formValues);

    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};

const updateProductQuantity = async (formValues) => {
  try {
    const productRef = db.collection("products").doc(formValues.productId);
    const productSnapshot = await productRef.get();

    if (productSnapshot.exists) {
      const currentQuantity = productSnapshot.data().sl;
      let newQuantity;

      if (formValues.loaiGD) {
        newQuantity = currentQuantity - formValues.sl;
      } else {
        newQuantity = currentQuantity + formValues.sl;
      }

      await productRef.update({ sl: newQuantity });
      console.log("Product quantity updated successfully.");
    } else {
      console.log("Product not found.");
    }
  } catch (error) {
    console.error("Error updating product quantity: ", error);
  }
};

export { GetEmployee, GetCustomer, GetProduct, AddTransactionData };
