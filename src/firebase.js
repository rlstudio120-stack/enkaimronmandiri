import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// GANTI BAGIAN INI DENGAN KODE YANG ANDA COPY DARI FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyDKnm_KT0dJ0QUe-VfSDa-LsKeaIhh8Z34",
  authDomain: "enkaimronmandiri.firebaseapp.com",
  projectId: "enkaimronmandiri",
  storageBucket: "enkaimronmandiri.firebasestorage.app",
  messagingSenderId: "910033402168",
  appId: "1:910033402168:web:2dbf69be46e09b527769cd"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Database (Firestore) dan Penyimpanan (Storage)
export const db = getFirestore(app);
export const storage = getStorage(app);