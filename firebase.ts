import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "mailpractice-with-chatgpt.firebaseapp.com",
  projectId: "mailpractice-with-chatgpt",
  storageBucket: "mailpractice-with-chatgpt.appspot.com",
  messagingSenderId: "545994709818",
  appId: "1:545994709818:web:5f9b2b7ce1f2ed4ae70e03",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
