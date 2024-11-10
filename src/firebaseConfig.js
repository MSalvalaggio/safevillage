import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCZUnOHxGoNRhAPRtKVCP1KaxFkHmY8gjQ',
  authDomain: 'safevillage-studio.firebaseapp.com',
  projectId: 'safevillage-studio',
  storageBucket: 'safevillage-studio.appspot.com',
  messagingSenderId: '415047605923',
  appId: '1:415047605923:web:c8a2060053db164b9c2916',
  measurementId: 'G-3BZ2GJ3BQM',
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;