// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD13ajiY6S8FKlzmQJ-meMgDyJUNxOOq2w",
  authDomain: "peekaboo-fbf1a.firebaseapp.com",
  projectId: "peekaboo-fbf1a",
  storageBucket: "peekaboo-fbf1a.firebasestorage.app",
  messagingSenderId: "1081048087865",
  appId: "1:1081048087865:web:c4ee154d91bd5383b77ce8",
  measurementId: "G-4QL0YP0K91"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
console.log(auth.currentUser)
//getAuth(app).tenantId = "chat-um-bhulo";
//const storage = getStorage(app);
if (process.env.NODE_ENV === "development") {
        connectAuthEmulator(getAuth(app), "http://localhost:9099");
        connectFirestoreEmulator(getFirestore(app), "localhost", 8080);
        const functions = getFunctions(getApp());
        connectFunctionsEmulator(functions, "localhost", 5001);
        //connectStorageEmulator(storage, "localhost", 9199);
}

//export const analytics = getAnalytics(app);

