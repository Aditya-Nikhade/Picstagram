import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDEVfiVXwLxv8UdGAd1TxhVzdim6a4vPyU",
  authDomain: "pics-de66c.firebaseapp.com",
  projectId: "pics-de66c",
  storageBucket: "pics-de66c.appspot.com",
  messagingSenderId: "315796115196",
  appId: "1:315796115196:web:7981295ff5c041bff01179",
  measurementId: "G-4KZEFJ230H"
};

const firebaseApp = initializeApp(firebaseConfig); 
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp)
const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export {auth,googleProvider,storage}
export default db;