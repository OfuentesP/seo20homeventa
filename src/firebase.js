// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkURsQHw8t2oi8IDsbV6A82u28bJqFO58",
  authDomain: "seo20home.firebaseapp.com",
  projectId: "seo20home",
  storageBucket: "seo20home.firebasestorage.app",
  messagingSenderId: "729594919170",
  appId: "1:729594919170:web:3e1529db3b8af93b6fea1b",
  measurementId: "G-1WPF8R95L9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)

export { db }