import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBS7_flnNygvSwcQWaIotoonvNUGTkEMjc',
  authDomain: 'himalayacrackers-c054c.firebaseapp.com',
  projectId: 'himalayacrackers-c054c',
  storageBucket: 'himalayacrackers-c054c.firebasestorage.app',
  messagingSenderId: '58309155810',
  appId: '1:58309155810:web:95fc33c9ba3a7d6e73b7bb',
  measurementId: 'G-QMVL6C5EF7',
};
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
