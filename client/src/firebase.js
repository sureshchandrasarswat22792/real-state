// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-state-a784d.firebaseapp.com",
  projectId: "real-state-a784d",
  storageBucket: "real-state-a784d.appspot.com",
  messagingSenderId: "1069627627016",
  appId: "1:1069627627016:web:17d9967de2b432630da3bd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);