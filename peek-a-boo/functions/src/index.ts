/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { user } from "firebase-functions/v1/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

initializeApp();
const db = getFirestore();

exports.userCreated = user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;

  const newUser = {
    uid,
    email,
    displayName,
    photoURL,
    createdAt: user.metadata.creationTime,
  };

  return db
    .collection("users")
    .doc(uid)
    .set(newUser)
    .catch((error) => {
      console.error("Error creating user document:", error);
    });
})

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
