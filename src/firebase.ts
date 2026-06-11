import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⬇️ PEGÁ ACÁ tu firebaseConfig cuando lo tengas de console.firebase.google.com
const firebaseConfig = {
  apiKey: "PEGAR_API_KEY",
  authDomain: "PEGAR_AUTH_DOMAIN",
  projectId: "PEGAR_PROJECT_ID",
  storageBucket: "PEGAR_STORAGE_BUCKET",
  messagingSenderId: "PEGAR_MESSAGING_SENDER_ID",
  appId: "PEGAR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const APP_ID = 'mundial-2026';
