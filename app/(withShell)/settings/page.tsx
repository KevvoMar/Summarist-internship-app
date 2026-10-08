"use client";

import { useAppSelector } from "@/app/redux/hooks";
import { useState, useEffect } from "react";
import Link from "next/link";
import Login from "../../components/login";
import styles from "./page.module.css";

// 1. Import routing mechanisms and your local Firebase setup configuration
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "../../firebase"; // Double check that this folder path accurately targets your firebase config!
import { doc, updateDoc } from "firebase/firestore";

export default function Settings() {
  const user = useAppSelector((state) => state.auth.user);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // 2. Initialize the search parameter catcher and clean router mechanisms
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = searchParams.get("plan");

  // 3. Keep your normal skeleton loading animation delay mechanism
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // 4. NEW EFFECT: Captures incoming Stripe success triggers and records them into Firestore
  useEffect(() => {
    async function handleSuccessfulPayment() {
      // If a plan parameter exists in the URL and a user is logged in
      if (planParam && user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          
          // Save the premium tier update status back to the user's specific document account profile
          await updateDoc(userRef, {
            subscriptionPlan: "Premium",
            planType: planParam,
          });

          alert("Success! Your subscription status has updated to Premium.");
          
          // Wipe out the '?plan=...' extension text string from the browser bar cleanly
          router.replace("/settings");
        } catch (error) {
          console.error("Firestore submission save failed:", error);
        }
      }
    }

    handleSuccessfulPayment();
  }, [planParam, user?.uid, router]);
    
  if (loading) {
    return (
      <div className="container">
        <div className="row">
          <div style={{ width: "100%", padding: "20px", display: "flex", flexDirection: "column" }}>
            <div
              className="skeleton"
              style={{ width: "160px", height: "32px", marginBottom: "60px" }}
            ></div>
            <div
              className="skeleton"
              style={{ width: "240px", height: "100px", marginBottom: "30px" }}
            ></div>
            <div
              className="skeleton"
              style={{ width: "240px", height: "100px", marginBottom: "30px" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className={styles.settings}>
          <h1 className={styles.settings__title}>Settings</h1>

          {user ? (
            <>
              <div className={styles.subscription}>
                <h2 className={styles.settings__subtitle}>Your Subscription Plan</h2>
                <p className={styles.settings__p}>
                  {user?.subscriptionPlan || "Basic"}
                </p>
                {(user?.subscriptionPlan === "Basic" || !user?.subscriptionPlan) && (
                  <Link href="/choose-plan">
                    <button className={`btn ${styles.upgrade__btn}`}>
                      Upgrade to Premium
                    </button>
                  </Link>
                )}
              </div>
              <div className={styles.email}>
                <h2 className={styles.settings__subtitle}>Email</h2>
                <p className={styles.settings__p}>
                  {user?.email}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className={styles.logged__out}>
                <figure className={styles.login__imgWrapper}>
                  <img className={styles.login__img} src="/assets/login.png" alt="Login required" />
                </figure>
                <h2 className={styles.settings__login}>
                  Log in to your account to see your details.
                </h2>
                <button
                  className={`btn ${styles.login__btn}`}
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </button>
              </div>
              {showLogin && (
                <Login
                  onClose={() => setShowLogin(false)}
                  origin="/settings"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
