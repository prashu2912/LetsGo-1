import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB5KvtWbu9KtFWBid4HgIPvQ4qpTBdONCo",
    authDomain: "web-app-8f3ea.firebaseapp.com",
    projectId: "web-app-8f3ea",
    storageBucket: "web-app-8f3ea.firebasestorage.app",
    messagingSenderId: "576736539549",
    appId: "1:576736539549:web:08deca1a599f5d677f3574",
    measurementId: "G-QNPBVHBGV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
