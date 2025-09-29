// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD13ajiY6S8FKlzmQJ-meMgDyJUNxOOq2w",
  authDomain: "peekaboo-fbf1a.firebaseapp.com",
  databaseURL: "https://peekaboo-fbf1a-default-rtdb.firebaseio.com",
  projectId: "peekaboo-fbf1a",
  storageBucket: "peekaboo-fbf1a.firebasestorage.app",
  messagingSenderId: "1081048087865",
  appId: "1:1081048087865:web:c4ee154d91bd5383b77ce8",
  measurementId: "G-4QL0YP0K91"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const database = getDatabase(app);

if (process.env.NODE_ENV === "development") {
  const host = window.location.hostname;
  console.log(`Connecting to emulators at ${host}`);

  // Connect JS SDK to emulators
  connectAuthEmulator(getAuth(app), `http://${host}:9099`);
  connectFirestoreEmulator(getFirestore(app), host, 8080);
  connectFunctionsEmulator(functions, host, 5001);
  connectDatabaseEmulator(database, host, 9000);
  connectStorageEmulator(storage, host, 9199);

}

//export const analytics = getAnalytics(app);

