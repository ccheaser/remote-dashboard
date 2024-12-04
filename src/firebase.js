// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Ana Firebase Config (Bu bilgileri kendi Firebase projenizden almanız gerekiyor)
const firebaseConfig = {
  apiKey: "AIzaSyBwXdQWx9YufEC3GCicd1fYVf6gQmC-UCI",
  authDomain: "ally-information.firebaseapp.com",
  databaseURL: "https://ally-information-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ally-information",
  storageBucket: "ally-information.firebasestorage.app",
  messagingSenderId: "467596901931",
  appId: "1:467596901931:web:1a12fa2f4104dcad78b46e"
};

// Firebase App'ini başlat
const app = initializeApp(firebaseConfig);

// Auth, Firestore ve Realtime Database servislerini al
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);

// (Opsiyonel) Başka Firebase servislerini de buradan alabilirsiniz
// export const storage = getStorage(app);
