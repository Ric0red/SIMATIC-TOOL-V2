//import 'firebase/compat/app';
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage  } from "firebase/storage";
//import { getMessaging } from "firebase/messaging";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDG6cnG8REq-P83CksBsZ5vq0r-sgYTvs8",
  authDomain: "fertilizantesoriente23.firebaseapp.com",
  projectId: "fertilizantesoriente23",
  storageBucket: "fertilizantesoriente23.appspot.com",
  messagingSenderId: "124297390146",
  appId: "1:124297390146:web:54492e5718bcad0e9125db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
//export const messaging = getMessaging(app);
export default app;


