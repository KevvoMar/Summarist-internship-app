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
import styles from "./page.module.css";
import { PiPlayCircleFill, PiClockBold, PiStarBold } from "react-icons/pi";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ForYou() {
  const user = useAppSelector((state) => state.auth.user);
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageLoaded, setSelectedImageLoaded] = useState(false);
  const [recommendedImageLoaded, setRecommendedImageLoaded] = useState<Record<string, boolean>>({});
  const [suggestedImageLoaded, setSuggestedImageLoaded] = useState<Record<string, boolean>>({});

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
  async function fetchBooks() {
    const selectedRes = await fetch(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
    );
    const recommendedRes = await fetch(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
    );
    const suggestedRes = await fetch(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
    );

    const selectedData = await selectedRes.json();
    const recommendedData = await recommendedRes.json();
    const suggestedData = await suggestedRes.json();

    const selectedWithDuration = await Promise.all(
      selectedData.map(async (book: Book) => {
        if (!book.audioLink) return { ...book, duration: 0 };
        return {
          ...book,
          duration: await getAudioDuration(book.audioLink)
        };
      })
    );

    const recommendedWithDuration = await Promise.all(
      recommendedData.map(async (book: Book) => {
        if (!book.audioLink) return { ...book, duration: 0 };
        return {
          ...book,
          duration: await getAudioDuration(book.audioLink)
        };
      })
    );

    const suggestedWithDuration = await Promise.all(
      suggestedData.map(async (book: Book) => {
        if (!book.audioLink) return { ...book, duration: 0 };
        return {
          ...book,
          duration: await getAudioDuration(book.audioLink)
        };
      })
    );

    setSelectedBooks(selectedWithDuration);
    setRecommendedBooks(recommendedWithDuration);
    setSuggestedBooks(suggestedWithDuration);

    setLoading(false);
  }

    fetchBooks();
  }, []);

  useEffect(() => {
    const wrappers = document.querySelectorAll(
      `.${styles.recommended__wrapper}, .${styles.suggested__wrapper}`
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

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const formatMinutesSeconds = (sec: number) => {
    if (!sec || isNaN(sec)) return "0 min 0 sec";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m} min ${s} sec`;
  }

  return (
    <>
      <section className={styles.selected}>
        <div className="container">
          <div className="row">
            <h1 className={styles.forYou__title}>Selected just for you</h1>
            {loading ? (
              <div className="skeleton" style={{width: "680px", height: "188px"}}>
              </div>
            ) : (
              selectedBooks.length > 0 && (
                <Link className={styles.selected__book} href={`/book/${selectedBooks[0].id}`}>
                  <p className={styles.selected__subtitle}>{selectedBooks[0].subTitle}</p>
                  <div className={styles.separator}></div>
                  <div className={styles.selected__description}>
                    <div className={styles.img__wrapperSelected}>
                      {!selectedImageLoaded && (
                        <div className="skeleton" style={{ width: "120px", height: "140px" }}></div>
                      )}
                      <img
                        className={styles.selected__img}
                        src={selectedBooks[0].imageLink}
                        onLoad={() => setSelectedImageLoaded(true)}
                      />
                    </div>
                    <div className={styles.selected__details}>
                      <h2 className={styles.selected__title}>{selectedBooks[0].title}</h2>
                      <p className={styles.selected__author}>{selectedBooks[0].author}</p>
                      <div className={styles.selected__audio}>
                        <PiPlayCircleFill className={styles.playbtn} />
                        <p className={styles.selected__duration}>{formatMinutesSeconds(selectedBooks[0].duration)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>
      <section className={styles.recommended}>
        <div className="container">
          <div className="row">
            <h1 className={styles.forYou__title}>Recommended For You</h1>
            <h2 className={styles.forYou__subtitle}>We think you'll like these</h2>
            <div className={styles.recommended__wrapper}>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className={styles.recommended__book}>
                    <div className="skeleton" style={{ width: "180px", height: "260px" }}></div>
                    <div className="skeleton" style={{ width: "140px", height: "20px", marginTop: "12px" }}></div>
                    <div className="skeleton" style={{ width: "100px", height: "16px", marginTop: "8px" }}></div>
                    <div className="skeleton" style={{ width: "160px", height: "16px", marginTop: "8px" }}></div>
                  </div>
                ))
              ) : (
                recommendedBooks.map((book) => (
                  <Link key={book.id} className={styles.recommended__book} href={`/book/${book.id}`}>
                    {(!user || user.subscriptionPlan === "Basic") && book.subscriptionRequired && (
                      <div className={styles.premium}>Premium</div>
                    )}
                    <div className={styles.img__wrapper}>
                      {!recommendedImageLoaded[book.id] && (
                        <div className="skeleton" style={{ width: "140px", height: "172px" }}></div>
                      )}
                      <img
                        className={styles.recommended__img}
                        src={book.imageLink}
                        onLoad={() =>
                          setRecommendedImageLoaded((prev) => ({ ...prev, [book.id]: true }))
                        }
                        style={{ display: recommendedImageLoaded[book.id] ? "block" : "none" }}
                      />
                    </div>
                    <h1 className={styles.recommended__title}>{book.title}</h1>
                    <p className={styles.recommended__author}>{book.author}</p>
                    <h2 className={styles.recommended__subtitle}>{book.subTitle}</h2>
                    <div className={styles.recommended__details}>
                      <PiClockBold className={styles.clock} />
                      <p className={styles.recommended__duration}>{formatTime(book.duration)}</p>
                      <PiStarBold className={styles.star} />
                      <p className={styles.recommended__rating}>{book.averageRating}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      <section className={styles.suggested}>
        <div className="container">
          <div className="row">
            <h1 className={styles.forYou__title}>Suggested Books</h1>
            <h2 className={styles.forYou__subtitle}>Browse those books</h2>
            <div className={styles.suggested__wrapper}>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className={styles.suggested__book}>
                  <div className="skeleton" style={{ width: "180px", height: "260px" }}></div>
                  <div className="skeleton" style={{ width: "140px", height: "20px", marginTop: "12px" }}></div>
                  <div className="skeleton" style={{ width: "100px", height: "16px", marginTop: "8px" }}></div>
                  <div className="skeleton" style={{ width: "160px", height: "16px", marginTop: "8px" }}></div>
                </div>
              ))
            ) : (
              suggestedBooks.map((book) => (
                <Link key={book.id} className={styles.suggested__book} href={`/book/${book.id}`}>
                    {(!user || user.subscriptionPlan === "Basic") && book.subscriptionRequired && (
                      <div className={styles.premium}>Premium</div>
                    )}
                  <div className={styles.img__wrapper}>
                    {!suggestedImageLoaded[book.id] && (
                      <div className="skeleton" style={{ width: "140px", height: "172px" }}></div>
                    )}
                    <img
                      className={styles.suggested__img}
                      src={book.imageLink}
                      onLoad={() =>
                        setSuggestedImageLoaded((prev) => ({ ...prev, [book.id]: true }))
                      }
                    />
                  </div>
                  <h1 className={styles.suggested__title}>{book.title}</h1>
                  <p className={styles.suggested__author}>{book.author}</p>
                  <h2 className={styles.suggested__subtitle}>{book.subTitle}</h2>
                  <div className={styles.suggested__details}>
                    <PiClockBold className={styles.clock} />
                    <p className={styles.suggested__duration}>{formatTime(book.duration)}</p>
                    <PiStarBold className={styles.star} />
                    <p className={styles.suggested__rating}>{book.averageRating}</p>
                  </div>
                </Link>
              ))
            )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}