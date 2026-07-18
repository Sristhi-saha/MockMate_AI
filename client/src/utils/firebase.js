
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mockmateai-9230d.firebaseapp.com",
  projectId: "mockmateai-9230d",
  storageBucket: "mockmateai-9230d.firebasestorage.app",
  messagingSenderId: "751987105753",
  appId: "1:751987105753:web:d1d49188232d8f0c5ac3c8"
};



const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export {auth,provider} 