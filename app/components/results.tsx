"use client";

interface Book {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
}

import styles from "./results.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { PiClockBold } from "react-icons/pi";

export default function Results({ search }: {search: string}) {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [durations, setDurations] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!search || search.trim() === "") {
      setBooks([]);
      return;
    }

    const controller = new AbortController();
    const delay = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${search}`,
          { signal: controller.signal }
        );

    const data: Book[] = await res.json();
    setBooks(data);
      } catch (err: any) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); 

    return () => {
      controller.abort();
      clearTimeout(delay);
    };
  }, [search]);

  useEffect(() => {
    async function loadDurations() {
      const map: Record<string, number> = {};

      await Promise.all(
        books.map(async (book) => {
          const dur = await getAudioDuration(book.audioLink);
          map[book.id] = dur;
        })
      );

      setDurations(map);
    }

    if (books.length > 0) {
      loadDurations();
    }
  }, [books]);

  async function getAudioDuration(url: string) {
    return new Promise<number>((resolve) => {
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

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className={styles.results}>
      {loading ? (
        [...Array(5)].map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ width: "100%", height: "114px", marginBottom: "4px" }}
          ></div>
        ))
      ) : books.length === 0 && search.trim() !== "" ? (
        <p className={styles.no__results}>No books found</p>
      ) : (
        books.map((book) => (
          <Link key={book.id} className={styles.link} href={`/book/${book.id}`}>
            <img className={styles.book__img} src={book.imageLink} loading="lazy" />
            <div className={styles.book__details}>
              <h1 className={styles.book__title}>{book.title}</h1>
              <p className={styles.book__author}>{book.author}</p>
              <div className={styles.book__time}>
                <PiClockBold className={styles.clock} />
                <p className={styles.book__duration}>{formatTime(durations[book.id])}</p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}