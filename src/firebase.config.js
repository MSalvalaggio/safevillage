import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-yWrlY3vR1wHzmR3qNwRoJEyEtXmdx-k",
  authDomain: "safevillage-studio.firebaseapp.com",
  projectId: "safevillage-studio",
  storageBucket: "safevillage-studio.appspot.com",
  messagingSenderId: "415047605923",
  appId: "1:415047605923:web:c8a2060053db164b9c2916",
  measurementId: "G-3BZ2GJ3BQM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const storage = getStorage(app);
const db = getFirestore(app);

export { app, storage, db };
