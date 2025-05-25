// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEvd52LuKZGRegFS9Trr_A0G1FfcURWoY",
  authDomain: "pastebin-20ec1.firebaseapp.com",
  projectId: "pastebin-20ec1",
  storageBucket: "pastebin-20ec1.firebasestorage.app",
  messagingSenderId: "868883940451",
  appId: "1:868883940451:web:30262cd8c46d93c8d4a456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
