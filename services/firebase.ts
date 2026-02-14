
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your actual Firebase project config from the Firebase Console
// Go to: console.firebase.google.com -> Create Project -> Add Web App -> Copy Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if we have a valid key (prevents crashing in pure demo mode without keys)
let app;
let db: any = null;
let auth: any = null;

const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey !== "undefined";

if (hasConfig) {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
    } catch (e) {
        console.warn("Firebase initialization failed:", e);
    }
} else {
    console.warn("Firebase config missing. Falling back to local storage mode.");
}

export { db, auth };
