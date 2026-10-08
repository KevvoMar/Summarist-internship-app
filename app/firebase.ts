"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGtxqZDK2BYM-smsb_ois6SU-I-vsz0qg",
  authDomain: "summarist-47c54.firebaseapp.com",
  projectId: "summarist-47c54",
  storageBucket: "summarist-47c54.firebasestorage.app",
  messagingSenderId: "809664629707",
  appId: "1:809664629707:web:c8b114f14ab6f511e5444e",
  measurementId: "G-MP22JHE7JZ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);