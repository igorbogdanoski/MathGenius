
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your actual Firebase project config from the Firebase Console
// Go to: console.firebase.google.com -> Create Project -> Add Web App -> Copy Config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "mathgenius-app.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "mathgenius-app",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "mathgenius-app.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "00000000000",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:00000000000:web:00000000000000",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if we have a valid key (prevents crashing in pure demo mode without keys)
let app;
let db: any;
let auth: any;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
} catch (e) {
    console.warn("Firebase config missing or invalid. Falling back to local storage mode.");
}

export { db, auth };
