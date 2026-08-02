// web-info/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlor_folN6Rkn1WnPZWroPqYyVETuKUnU",
  authDomain: "vip-games-93cb5.firebaseapp.com",
  projectId: "vip-games-93cb5",
  storageBucket: "vip-games-93cb5.firebasestorage.app",
  messagingSenderId: "455013507500",
  appId: "1:455013507500:web:ea28a2fcb0170464b71a09"};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { 
  app, 
  db, 
  auth, 
  // Firestore methods
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  // Auth methods
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
};