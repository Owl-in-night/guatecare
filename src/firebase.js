// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCr8aEd9r52DuAyTHr-M0oziRwT4yhwcko",
  authDomain: "guatecare-68bb8.firebaseapp.com",
  projectId: "guatecare-68bb8",
  storageBucket: "guatecare-68bb8.appspot.com",
  messagingSenderId: "623284316729",
  appId: "1:623284316729:web:0eacbc8a79903305b43be8",
  measurementId: "G-4YM5ECKDN6"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app)
//const analytics = getAnalytics(app);

export { db, storage, auth};