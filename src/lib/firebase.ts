import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFyPLmRjRiGHBoFQsidtrvZ_PaDvj0b2Q",
  authDomain: "mobiwise-auth.firebaseapp.com",
  projectId: "mobiwise-auth",
  storageBucket: "mobiwise-auth.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef0123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Use emulators in development
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}

export { auth, db, storage };

// Firestore collections
export const collections = {
  products: 'products',
  orders: 'orders',
  settings: 'settings',
  content: 'content',
};
