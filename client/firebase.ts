// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-estate-58671.firebaseapp.com',
  projectId: 'mern-estate-58671',
  storageBucket: 'mern-estate-58671.appspot.com',
  messagingSenderId: '983902831358',
  appId: '1:983902831358:web:ccd8dda723ca6cc5f29baf',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig); 