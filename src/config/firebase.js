import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDtZ7aamgA7urq2FbZhv0H_XLq1QUJq32A",
  authDomain: "web3-5a98b.firebaseapp.com",
  databaseURL: "https://web3-5a98b-default-rtdb.firebaseio.com",
  projectId: "web3-5a98b",
  storageBucket: "web3-5a98b.appspot.com",
  messagingSenderId: "743897217564",
  appId: "1:743897217564:web:a0198a82bcb5276f4d3dd9",
  measurementId: "G-1BT93FY6TG"


};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
