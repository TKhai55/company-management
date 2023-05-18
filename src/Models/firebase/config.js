import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJu0HgxMdL2KBXEHYOVB6mjHMBKdFxPY4",
  authDomain: "company-management-6a229.firebaseapp.com",
  projectId: "company-management-6a229",
  storageBucket: "company-management-6a229.appspot.com",
  messagingSenderId: "217168167925",
  appId: "1:217168167925:web:26a24a35db1dad4a4456bc",
  measurementId: "G-SXV3Z57TRZ",

  //test
  // apiKey: "AIzaSyCFJTRXM8badwGmz74U_b3oFM4UCF-13wc",
  // authDomain: "test-da1.firebaseapp.com",
  // projectId: "test-da1",
  // storageBucket: "test-da1.appspot.com",
  // messagingSenderId: "593923671432",
  // appId: "1:593923671432:web:fb7e1cf25302e81313a63d",
  // measurementId: "G-6Y54KJBS8F",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { db, auth };
export default firebase;
