import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA01DPesY-VdIM9ii67F3a3gcsCCb71foQ",
  authDomain: "cultivo-mym.firebaseapp.com",
  projectId: "cultivo-mym",
  storageBucket: "cultivo-mym.firebasestorage.app",
  messagingSenderId: "371652946176",
  appId: "1:371652946176:web:de9f6a225cc25a3229ebe5",
  measurementId: "G-W2PB03Y9CK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);