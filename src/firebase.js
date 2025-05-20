// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "yourproject.firebaseapp.com",
  // ... rest of config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
