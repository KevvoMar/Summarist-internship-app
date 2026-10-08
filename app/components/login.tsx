"use client";

import Link from "next/link";
import styles from "./login.module.css";
import { IoClose, IoPersonSharp } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { auth } from "../firebase";
import { db } from "../firebase"; 
import { doc, getDoc, setDoc } from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail 
} from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";


export default function Login({ onClose, origin }: { onClose: () => void, origin: string | null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  async function ensureUserDocument(user: User) {
    if (user.uid === "guest") return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        subscriptionPlan: "Basic",
        librarySaved: [],
        libraryFinished: []
      });
    }
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEmailPasswordLogin = () => {
    setLoading(true);
    setErrorMsg("");

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        await ensureUserDocument(user);
        setLoading(false);

        setTimeout(() => {
          onClose();

          if (origin === "/") {
            router.push("/for-you");
          } else {
            router.refresh();
          }
        }, 300);
      })
      .catch((error: any) => {
        console.error("Error signing in:", error?.code, error);
        setErrorMsg(error?.message || "Invalid email or password."); 
        setLoading(false);
      });
  };

  const handleGuestLogin = () => {
    setGuestLoading(true);

    signInWithEmailAndPassword(auth, "guest@summarist.com", "guest123");
    setTimeout(() => {
      setGuestLoading(false);
      onClose();

      if (origin === "/") {
        router.push("/for-you");
          } else {
            router.refresh();
          }
        }, 1200);
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setErrorMsg("");

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;

        await ensureUserDocument(user);
        setGoogleLoading(false);

        setTimeout(() => {
          onClose();

          if (origin === "/") {
            router.push("/for-you");
          } else {
            router.refresh();
          }
        }, 300);
      })
      .catch((error: any) => {
        // FIXED: Using a safe string fallback so missing parameters don't crash compilation
        console.error("Google sign-in failed:", error);
        setErrorMsg(error?.message || "Google authentication failed. Please try again.");
        setGoogleLoading(false);
      });
  };

  const handleSignUp = () => {
    setLoading(true);
    setErrorMsg("");

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        await ensureUserDocument(user);
        setTimeout(() => {
          onClose();
          router.push("/for-you");
        }, 300);
      })
      .catch((error: any) => {
        console.error("Sign-up error:", error?.code, error);
        setErrorMsg(error?.message || "Account creation failed. Please check your data.");
        setLoading(false);
      });
  };

  const handleResetPassword = () => {
    setLoading(true);
    setErrorMsg("");

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setErrorMsg("Password reset link sent to your email.");
        setLoading(false)
      })
      .catch((error: any) => {
        console.error("Reset error:", error);
        setErrorMsg(error?.message || "Failed to dispatch password recovery mail.");
        setLoading(false);
      });
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.authentication}>
        <IoClose className={styles.close} onClick={onClose} />

        <h1 className={styles.auth__title}>
          {isForgotPassword
            ? "Reset your password"
            : isSignup
              ? "Sign up to Summarist"
              : "Login to Summarist"}
        </h1>

        {errorMsg && (
          <p className={styles.error}>{errorMsg}</p>
        )}
        
        {!isSignup && !isForgotPassword && (
          <>
            <button
              className={`${styles.auth__box} ${styles.guest}`}
              onClick={handleGuestLogin}
              disabled={guestLoading}
            >
              {guestLoading ? (
                <AiOutlineLoading3Quarters className={styles.spinner} />
              ) : (
                <>
                  <div className={`${styles.auth__icon} ${styles.auth__iconGuest}`}>
                    <IoPersonSharp />
                  </div>
                  <p className={styles.auth__login}>Login as a Guest</p>
                </>
              )}
            </button>
            <div className={styles.seperator}>
              <div className={styles.or__stripe}></div>
              <p className={styles.or}>or</p>
              <div className={styles.or__stripe}></div>
            </div>
          </>
        )}

        {!isForgotPassword && (
          <>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className={`${styles.auth__box} ${styles.google}`}
            >
              {googleLoading ? (
                <AiOutlineLoading3Quarters className={styles.spinner} />
              ) : (
                <>
                  <div className={`${styles.auth__icon} ${styles.auth__iconGoogle}`}>
                    <img src="/assets/google.png" />
                  </div>
                  <p className={styles.auth__login}>
                    {isSignup ? "Sign up with Google" : "Login with Google"}
                  </p>
                </>
              )}
            </button>

            <div className={styles.seperator}>
              <div className={styles.or__stripe}></div>
              <p className={styles.or}>or</p>
              <div className={styles.or__stripe}></div>
            </div>
          </>
        )}

        <div className={styles.form}>
          <input
            className={styles.input}
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!isForgotPassword && (
            <input
              className={styles.input}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          <button
            onClick={
              isForgotPassword
                ? handleResetPassword
                : isSignup
                  ? handleSignUp
                  : handleEmailPasswordLogin
            }
            disabled={loading}
            className={`btn ${styles.auth__btn}`}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className={styles.spinner} />
            ) : isForgotPassword ? (
              "Send reset password link"
            ) : isSignup ? (
              "Sign up"
            ) : (
              "Login"
            )}
          </button>
        </div>

        {!isSignup && !isForgotPassword && (
          <Link
            href=""
            className={`${styles.auth__link} ${styles.forgot__password}`}
            onClick={(e) => {
              e.preventDefault();
              setIsForgotPassword(true);
              setIsSignup(false);
            }}
          >
            Forgot your password?
          </Link>
        )}

        {isForgotPassword && (
          <Link
            href=""
            className={`${styles.auth__link} ${styles.forgot__password}`}
            onClick={(e) => {
              e.preventDefault();
              setIsForgotPassword(false);
              setIsSignup(false);
            }}
          >
            Back to login
          </Link>
        )}

        <Link
          href=""
          className={styles.auth__link}
          onClick={(e) => {
            e.preventDefault();
            if (isForgotPassword) {
              setIsForgotPassword(false);
              setIsSignup(true);
            } else {
              setIsSignup(!isSignup);
            }
            setErrorMsg("");
          }}
        >
          {isForgotPassword 
            ? "Don't have an account? Sign up" 
            : isSignup 
              ? "Already have an account? Login" 
              : "Don't have an account? Sign up"}
        </Link>
      </div>
    </div>
  );
}
