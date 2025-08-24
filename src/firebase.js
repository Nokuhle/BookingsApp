// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_drGmZLBg-zm_hWl9ntsuP36ehq57d18",
  authDomain: "portfolioauth-41341.firebaseapp.com",
  projectId: "portfolioauth-41341",
  storageBucket: "portfolioauth-41341.firebasestorage.app",
  messagingSenderId: "503843742010",
  appId: "1:503843742010:web:a0492094b1ec19b6717003",
  measurementId: "G-X71XECJY6J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);