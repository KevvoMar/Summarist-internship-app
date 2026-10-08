"use client";

// 1. Import Suspense from React to fix the prerender build block
import { Suspense, useState, useEffect } from "react";

// Import your custom strongly-typed Redux hooks and action
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { updateSubscriptionStatus } from "@/app/redux/authSlice";

import Link from "next/link";
import Login from "../../components/login";
import styles from "./page.module.css";

// Import routing mechanisms and your local Firebase setup configuration
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "../../firebase"; 
import { doc, updateDoc } from "firebase/firestore";

// --- CORE SETTINGS INTERNAL LAYOUT ---
function SettingsContent() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch(); 
  
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize the search parameter catcher and clean router mechanisms
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = searchParams.get("plan");

  // Keep your normal skeleton loading animation delay mechanism
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // MODIFIED EFFECT: Updates Cloud Firestore AND dispatches straight to Redux memory instantly
  useEffect(() => {
    async function handleSuccessfulPayment() {
      // If a plan parameter exists in the URL and a user is logged in
      if (planParam && user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          
          // A. Save the premium tier update status back to the user's Firestore document
          await updateDoc(userRef, {
            subscriptionPlan: "Premium",
            planType: planParam,
          });

          // B. Dispatch to Redux memory instantly so your UI text updates dynamically right now!
          dispatch(updateSubscriptionStatus("Premium"));

          alert("Success! Your subscription status has updated to Premium.");
          
          // Wipe out the '?plan=...' extension text string from the browser bar cleanly
          router.replace("/settings");
        } catch (error) {
          console.error("Firestore submission save failed:", error);
        }
      }
    }

    handleSuccessfulPayment();
  }, [planParam, user?.uid, router, dispatch]);
    
  if (loading) {
    return <SettingsSkeleton />;
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

// --- REUSABLE SKELETON LAYOUT COMPONENT ---
function SettingsSkeleton() {
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

// --- MASTER EXPORT WITH SUSPENSE WRAPPER ---
export default function Settings() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
}
