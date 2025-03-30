import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTs2Va0nXfcWW4z-2TbYGE56FcRcZ365w",
  authDomain: "bossgame1808.firebaseapp.com",
  projectId: "bossgame1808",
  storageBucket: "bossgame1808.firebasestorage.app",
  messagingSenderId: "615571891890",
  appId: "1:615571891890:web:94301abc9a4c95b5560bab",
  measurementId: "G-GREVSHDZJV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export const auth = getAuth(app);
export default app;