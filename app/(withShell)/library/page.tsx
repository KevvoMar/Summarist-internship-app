"use client";

interface Book {
  id: string;
  type: string;
  title: string;
  author: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
  duration: number;
}

import { useAppSelector } from "@/app/redux/hooks";
import { useState, useEffect } from "react";
import { PiClockBold, PiStarBold } from "react-icons/pi";
import styles from "./page.module.css";
import Link from "next/link";
import Login from "../../components/login";

export default function Library() {
  const user = useAppSelector((state) => state.auth.user);
  const librarySaved = user?.librarySaved || [];
  const libraryFinished = user?.libraryFinished || [];
  const [loading, setLoading] = useState(true);
  const [savedImageLoaded, setSavedImageLoaded] = useState<Record<string, boolean>>({});
  const [finishedImageLoaded, setFinishedImageLoaded] = useState<Record<string, boolean>>({});
  const [showLogin, setShowLogin] = useState(false);
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<Book[]>([]);

  async function getAudioDuration(url: string) {
    return new Promise((resolve) => {
      const audio = document.createElement("audio");
      audio.src = url;
      audio.preload = "metadata";
      audio.addEventListener("loadedmetadata", () => {
        resolve(audio.duration);
      });
      audio.addEventListener("error", () => {
        resolve(0);
      });
    });
  }

  useEffect(() => {
    async function loadDurations() {
      const savedWithDuration = await Promise.all(
        librarySaved.map(async (book) => ({
          ...book,
          duration: await getAudioDuration(book.audioLink)
        }))
      );

      const finishedWithDuration = await Promise.all(
        libraryFinished.map(async (book) => ({
          ...book,
          duration: await getAudioDuration(book.audioLink)
        }))
      );

      setSavedBooks(savedWithDuration);
      setFinishedBooks(finishedWithDuration);
      setLoading(false);
    }

    if (librarySaved.length > 0 || libraryFinished.length > 0) {
      loadDurations();
    } else {
      setLoading(false);
    }
  }, [librarySaved, libraryFinished]);

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    const wrappers = document.querySelectorAll(
      `.${styles.saved__wrapper}, .${styles.finished__wrapper}`
    );

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLDivElement).scrollLeft += e.deltaY;
    };

    wrappers.forEach((wrapper) => {
      (wrapper as HTMLDivElement).addEventListener("wheel", handleWheel);
    });

    return () => {
      wrappers.forEach((wrapper) => {
        (wrapper as HTMLDivElement).removeEventListener("wheel", handleWheel);
      });
    };
  }, []);

  return (
    <>
      {user ? (
        <>
          <section className={styles.saved}>
            <div className="container">
              <div className="row">
                <h1 className={styles.library__title}>Saved Books</h1>
                <p className={styles.number__ofItems}>{savedBooks.length} items</p>
                <div className={styles.saved__wrapper}>
                  {loading ? (
                    [...Array(6)].map((_, i) => (
                      <div key={i} className={styles.saved__book}>
                        <div className="skeleton" style={{ width: "180px", height: "260px" }}></div>
                        <div className="skeleton" style={{ width: "140px", height: "20px", marginTop: "12px" }}></div>
                        <div className="skeleton" style={{ width: "100px", height: "16px", marginTop: "8px" }}></div>
                        <div className="skeleton" style={{ width: "160px", height: "16px", marginTop: "8px" }}></div>
                      </div>
                    ))
                  ) : (
                    savedBooks.map((book) => (
                      <Link key={book.id} className={styles.saved__book} href={`/book/${book.id}`}>
                        {(!user || user.subscriptionPlan === "Basic") && book.subscriptionRequired && (
                          <div className={styles.premium}>Premium</div>
                        )}
                        <div className={styles.img__wrapper}>
                          {!savedImageLoaded[book.id] && (
                            <div className="skeleton" style={{ width: "140px", height: "172px" }}></div>
                          )}
                          <img
                            className={styles.saved__img}
                            src={book.imageLink}
                            onLoad={() =>
                              setSavedImageLoaded((prev) => ({ ...prev, [book.id]: true }))
                            }
                            style={{ display: savedImageLoaded[book.id] ? "block" : "none" }}
                          />
                        </div>
                        <h1 className={styles.saved__title}>{book.title}</h1>
                        <p className={styles.saved__author}>{book.author}</p>
                        <h2 className={styles.saved__subtitle}>{book.subTitle}</h2>
                        <div className={styles.saved__details}>
                          <PiClockBold className={styles.clock} />
                          <p className={styles.saved__duration}>{formatTime(book.duration)}</p>
                          <PiStarBold className={styles.star} />
                          <p className={styles.saved__rating}>{book.averageRating}</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
                {!loading && savedBooks.length === 0 && (
                  <div className={styles.zero__wrapper}>
                    <h2 className={styles.zero__title}>Save your favorite books!</h2>
                    <p className={styles.zero__p}>When you save a book, it will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
          <section className={styles.finished}>
            <div className="container">
              <div className="row">
                <h1 className={styles.library__title}>Finished</h1>
                <p className={styles.number__ofItems}>{finishedBooks.length} items</p>
                <div className={styles.finished__wrapper}>
                  {loading ? (
                    [...Array(6)].map((_, i) => (
                      <div key={i} className={styles.finished__book}>
                        <div className="skeleton" style={{ width: "180px", height: "260px" }}></div>
                        <div className="skeleton" style={{ width: "140px", height: "20px", marginTop: "12px" }}></div>
                        <div className="skeleton" style={{ width: "100px", height: "16px", marginTop: "8px" }}></div>
                        <div className="skeleton" style={{ width: "160px", height: "16px", marginTop: "8px" }}></div>
                      </div>
                    ))
                  ) : (
                    finishedBooks.map((book) => (
                      <Link key={book.id} className={styles.finished__book} href={`/book/${book.id}`}>
                        {(!user || user.subscriptionPlan === "Basic") && book.subscriptionRequired && (
                          <div className={styles.premium}>Premium</div>
                        )}
                        <div className={styles.img__wrapper}>
                          {!finishedImageLoaded[book.id] && (
                            <div className="skeleton" style={{ width: "140px", height: "172px" }}></div>
                          )}
                          <img
                            className={styles.finished__img}
                            src={book.imageLink}
                            onLoad={() =>
                              setFinishedImageLoaded((prev) => ({ ...prev, [book.id]: true }))
                            }
                            style={{ display: finishedImageLoaded[book.id] ? "block" : "none" }}
                          />
                        </div>
                        <h1 className={styles.finished__title}>{book.title}</h1>
                        <p className={styles.finished__author}>{book.author}</p>
                        <h2 className={styles.finished__subtitle}>{book.subTitle}</h2>
                        <div className={styles.finished__details}>
                          <PiClockBold className={styles.clock} />
                          <p className={styles.finished__duration}>{formatTime(book.duration)}</p>
                          <PiStarBold className={styles.star} />
                          <p className={styles.finished__rating}>{book.averageRating}</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
                {!loading && finishedBooks.length === 0 && (
                  <div className={styles.zero__wrapper}>
                    <h2 className={styles.zero__title}>Done and dusted!</h2>
                    <p className={styles.zero__p}>When you finish a book, you can find it here later.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <div className={styles.logged__out}>
            <figure className={styles.login__imgWrapper}>
              <img className={styles.login__img} src="/assets/login.png" alt="Login required" />
            </figure>
            <h2 className={styles.library__login}>
              Log in to your account to see your Library.
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
              origin="/library"
            />
          )}
        </>
      )}
    </>
  )
}