// frontend/src/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// ✅ Ganti dengan config dari Firebase Console → Project Settings → General → Your Apps (Web)
const firebaseConfig = {
  apiKey: "AIzaSyCiYO7QsJ5u1-v9_Bf9jITn5LJiTiMjLL0",
  authDomain: "samira-travel-810df.firebaseapp.com",
  projectId: "samira-travel-810df",
  storageBucket: "samira-travel-810df.firebasestorage.app",
  messagingSenderId: "127746202147",
  appId: "1:127746202147:web:7a11b4b5e698c04739af96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
