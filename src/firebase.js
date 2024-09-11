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
  apiKey: "AIzaSyBiVlSXul2cl6JxJ83ge4n2vxJ99zOAm_s",
  authDomain: "GuateCare-c1dd5.firebaseapp.com",
  projectId: "GuateCare-c1dd5",
  storageBucket: "GuateCare-c1dd5.appspot.com",
  messagingSenderId: "980052160479",
  appId: "1:980052160479:web:096ce5be2cc23e1a59de6a",
  measurementId: "G-VYPY5WFFLH"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app)
//const analytics = getAnalytics(app);

export { db, storage, auth};