"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { useParams } from "next/navigation";
import { useAudio } from "@/app/context/audioContext";

interface Book {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  summary: string;
  imageLink: string;
  audioLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
}

export default function Player() {
  const params = useParams();
  const id = params.id as string;
  const { summaryFontSize } = useAudio();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const { setBook: setGlobalBook } = useAudio();

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  useEffect(() => {
    if (book) {
      setGlobalBook(book);
    }
  }, [book]);

  if (loading || !book) {
    return (
      <section className={styles.book__summary}>
        <div className={styles.spinner__wrapper}>
          <LuLoaderCircle className={styles.spinner}/>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.book__summary}>
      <h1 className={styles.summary__title}>{book.title}</h1>
      <p className={styles.summary} style={{ fontSize: summaryFontSize }}>{book.summary}</p>
    </section>
  );
}