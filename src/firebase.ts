import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAzMUxOnwIpatNglROieQVg8cuhMX9taxk",
  authDomain: "mundial-2026-e46d8.firebaseapp.com",
  databaseURL: "https://mundial-2026-e46d8-default-rtdb.firebaseio.com",
  projectId: "mundial-2026-e46d8",
  storageBucket: "mundial-2026-e46d8.firebasestorage.app",
  messagingSenderId: "21267837108",
  appId: "1:21267837108:web:a55e541a3fa9997e37a7e1",
  measurementId: "G-V0CHYT9YRH"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
