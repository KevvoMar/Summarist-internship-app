"use client";

interface AuthProviderProps {
  children: React.ReactNode;
}

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./redux/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);

        let subscriptionPlan = "Basic";
        let librarySaved = [];
        let libraryFinished = [];

        try {
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              email: currentUser.email,
              uid: currentUser.uid,
              subscriptionPlan: "Basic",
              librarySaved: [],
              libraryFinished: []
            });
          } else {
            const data = userSnap.data();
            subscriptionPlan = data.subscriptionPlan || "Basic";
            librarySaved = data.librarySaved || [];
            libraryFinished = data.libraryFinished || [];
          }
        } catch (err) {
          console.error("Error loading/creating user document:", err);
        }

        dispatch(
          setUser({
            email: currentUser.email,
            uid: currentUser.uid,
            subscriptionPlan,
            librarySaved,
            libraryFinished
          })
        );
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsub();
  }, [dispatch]);

  return <>{children}</>;
}