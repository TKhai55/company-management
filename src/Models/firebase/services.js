import firebase, { db } from "./config";
import { collection, doc, setDoc } from "firebase/firestore";
import { message } from "antd";

export const addDocument = (collectionName, documentId, data) => {
  try {
    return new Promise(async (resolve, reject) => {
      setDoc(doc(db, collectionName, documentId), {
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          message.error(error);
          reject(false);
        });
    });
  } catch (error) {
    console.error("Error adding document:", error);
    return false;
  }
};
