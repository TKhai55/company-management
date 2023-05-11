import { initializeApp } from "firebase/app";
import 'firebase/database';
import {
  getFirestore, collection,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCJu0HgxMdL2KBXEHYOVB6mjHMBKdFxPY4",
  authDomain: "company-management-6a229.firebaseapp.com",
  projectId: "company-management-6a229",
  storageBucket: "company-management-6a229.appspot.com",
  messagingSenderId: "217168167925",
  appId: "1:217168167925:web:26a24a35db1dad4a4456bc",
  measurementId: "G-SXV3Z57TRZ"
};

// init firebase
const app = initializeApp(firebaseConfig);

// init services
const db = getFirestore(app);

export default db;