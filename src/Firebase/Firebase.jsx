// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJZlUXl03Xzb666vKSVkEaHgdNzdNN9x4",
  authDomain: "webfinalproject2025g1.firebaseapp.com",
  projectId: "webfinalproject2025g1",
  storageBucket: "webfinalproject2025g1.firebasestorage.app",
  messagingSenderId: "530283357366",
  appId: "1:530283357366:web:3a252bc2efefb4d1b93217"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;