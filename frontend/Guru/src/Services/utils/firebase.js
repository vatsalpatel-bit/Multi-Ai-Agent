// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "multi-ai-agent-6f2d0.firebaseapp.com",
  projectId: "multi-ai-agent-6f2d0",
  storageBucket: "multi-ai-agent-6f2d0.firebasestorage.app",
  messagingSenderId: "95470269502",
  appId: "1:95470269502:web:7668bf07ebbc87bb3acd6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
