// js/firebase.js — Inicialización de Firebase
// Este archivo carga Firebase desde CDN (sin npm, funciona en Netlify directamente)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCkzl2sPvDZ4cn3QdfikiREas5U5KUjfEA",
  authDomain:        "tekton-5d2da.firebaseapp.com",
  projectId:         "tekton-5d2da",
  storageBucket:     "tekton-5d2da.firebasestorage.app",
  messagingSenderId: "420545398258",
  appId:             "1:420545398258:web:ac73c77ef1dc83b261576b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
