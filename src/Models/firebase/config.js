import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdZ1YVlladTrLXk2mpcGxUXQgRRkLKg4c",
  authDomain: "project-1-dad3a.firebaseapp.com",
  projectId: "project-1-dad3a",
  storageBucket: "project-1-dad3a.appspot.com",
  messagingSenderId: "116920897626",
  appId: "1:116920897626:web:4830a46c20ac1ad62b8863",
  measurementId: "G-YENZ26KDCY",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { db, auth };
export default firebase;
