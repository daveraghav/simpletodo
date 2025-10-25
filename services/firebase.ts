
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Replace this with your own Firebase project's configuration.
// You can get this from the Firebase console.
// Also, ensure you have enabled Email/Password sign-in in Firebase Authentication
// and created a Firestore database.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth and Firestore services
const auth = getAuth(app);
const firestore = getFirestore(app);

// IMPORTANT: For this app to be secure, you must set up Firestore Security Rules.
// An example rule to ensure users can only read/write their own todos would be:
/*
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /todos/{todoId} {
        allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      }
    }
  }
*/


export { auth, firestore };
