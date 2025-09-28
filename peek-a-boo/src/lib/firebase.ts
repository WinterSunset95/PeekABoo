// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { FirebaseAuthentication, UseEmulatorOptions } from "@capacitor-firebase/authentication";
import { FirebaseFirestore } from "@capacitor-firebase/firestore";
import { FirebaseFunctions } from "@capacitor-firebase/functions";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { FirebaseApp } from "@capacitor-firebase/app";
import { Capacitor } from "@capacitor/core";
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
  // If on web platform, connect to <url location eg. localhost, 192.168.210.163>:<port>
  console.log(window.location.hostname)
  const host = window.location.hostname
  console.log(Capacitor.getPlatform())
  if (Capacitor.getPlatform() === 'web') {
    connectAuthEmulator(getAuth(app), `http://${host}:9099`);
    connectFirestoreEmulator(getFirestore(app), host, 8080);
    connectFunctionsEmulator(functions, host, 5001);
    connectDatabaseEmulator(database, host, 9000);
    connectStorageEmulator(storage, host, 9199);
  } else {
    FirebaseAuthentication.useEmulator({ host: host, port: 9099 })
    FirebaseFirestore.useEmulator({ host: host, port: 8080 })
    FirebaseFunctions.useEmulator({ host: host, port: 5001 })
    connectAuthEmulator(getAuth(app), `http://${host}:9099`);
    connectFirestoreEmulator(getFirestore(app), host, 8080);
    connectFunctionsEmulator(functions, host, 5001);
    connectDatabaseEmulator(database, host, 9000);
    connectStorageEmulator(storage, host, 9199);
  }
  // If on android platform, connect to the emulators through capacitor-firebase plugin
}

//export const analytics = getAnalytics(app);

