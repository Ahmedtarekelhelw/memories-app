import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "memories-app-8517c.firebaseapp.com",
  projectId: "memories-app-8517c",
  storageBucket: "memories-app-8517c.appspot.com",
  messagingSenderId: "208618801016",
  appId: process.env.REACT_APP_FIREBASE_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
