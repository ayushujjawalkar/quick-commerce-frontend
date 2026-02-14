import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace these with your actual Firebase project credentials
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAn6ijb4fpxiZHWKW-PMKMaCbJz03WUpGc",
  authDomain: "quick-commerce-backend.firebaseapp.com",
  projectId: "quick-commerce-backend",
  storageBucket: "quick-commerce-backend.firebasestorage.app",
  messagingSenderId: "844151584398",
  appId: "1:844151584398:web:a42086ca1403fd3b19fbdf",
  measurementId: "G-TMPHKC9RQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;
