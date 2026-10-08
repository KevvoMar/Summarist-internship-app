"use client";

interface Book {
  id: string;
  tags: Array<string>;
  type: string;
  title: string;
  author: string;
  subTitle: string;
  summary: string;
  keyIdeas: number;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  bookDescription: string;
  authorDescription: string;
  subscriptionRequired: boolean;
}

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { PiStar, PiClock } from "react-icons/pi";
import { IoMicOutline } from "react-icons/io5";
import { HiOutlineLightBulb } from "react-icons/hi";
import { AiOutlineRead } from "react-icons/ai";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { db } from "@/app/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import Login from "@/app/components/login";
import { updateLibrarySaved } from "@/app/redux/authSlice";
import { useAppSelector } from "@/app/redux/hooks";

export default function Book() {
  const params = useParams();
  const id = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();

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
    if (!user || !book) return;

    const alreadySaved = user.librarySaved?.some(saved => saved.id === book.id);
    setIsSaved(alreadySaved);
  }, [user, book]);

  useEffect(() => {
    async function loadDuration() {
      if (!book || !book.audioLink) return;
      const dur = await getAudioDuration(book.audioLink);
      setDuration(dur);
    }

    loadDuration();
  }, [book]);

  async function getAudioDuration(url: string): Promise<number> {
    return new Promise<number>((resolve) => {
      const audio = document.createElement("audio");
      audio.src = url;
      audio.preload = "metadata";
      audio.addEventListener("loadedmetadata", () => resolve(audio.duration));
      audio.addEventListener("error", () => resolve(0));
    });
  }

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  async function toggleSave() {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const userRef = doc(db, "users", user!.uid);

    if (!book) return null;
    const bookData = {
      id: book.id,
      title: book.title,
      author: book.author,
      subTitle: book.subTitle,
      imageLink: book.imageLink,
      audioLink: book.audioLink,
      averageRating: book.averageRating,
      subscriptionRequired: book.subscriptionRequired
    };

    if (isSaved) {
      await updateDoc(userRef, {
        librarySaved: arrayRemove(bookData)
      });

      dispatch(updateLibrarySaved({
        type: "remove",
        book: bookData
      }));

      setIsSaved(false);
    } else {
      await updateDoc(userRef, {
        librarySaved: arrayUnion(bookData)
      });

      dispatch(updateLibrarySaved({
        type: "add",
        book: bookData
      }));

      setIsSaved(true);
    }
  }
  
  function handleReadClick() {
    if (!book) return null;

    if (!user) {
      setShowLogin(true);
      return;
    }

    if (user.subscriptionPlan === "Basic" && book.subscriptionRequired) {
      router.push("/choose-plan");
      return;
    }

    router.push(`/player/${book.id}`);
  }

  function handleListenClick() {
    if (!book) return null;

    if (!user) {
      setShowLogin(true);
      return;
    }

    if (user.subscriptionPlan === "Basic" && book.subscriptionRequired) {
      router.push("/choose-plan");
      return;
    }

    router.push(`/player/${book.id}`);
  }

  if (loading || !book) {
    return (
      <div className="container">
        <div className="row">
          <div className={styles.book__wrapper}>
            <figure className={styles.img__wrapper}>
              <div className="skeleton" style={{width:"300px", height:"300px"}}></div>
            </figure>
            <div className={styles.book__information}>
              <div className="skeleton" style={{width:"400px", height:"32px", marginBottom:"16px"}}></div>
              <div className="skeleton" style={{width:"100px", height:"16px", marginBottom:"16px"}}></div>
              <div className="skeleton" style={{width:"500px", height:"20px", marginBottom:"16px"}}></div>
              <div className="skeleton" style={{width:"300px", height:"60px", marginBottom:"16px"}}></div>
              <div className="skeleton" style={{width:"280px", height:"48px", marginBottom:"16px"}}></div>
              <div className="skeleton" style={{width:"200px", height:"20px", marginBottom:"16px"}}></div>
              <div className="skeleton" style={{width:"100px", height:"18px", marginBottom:"16px"}}></div>
              <div className="skeleton" style={{width:"280px", height:"48px", marginBottom:"16px"}}></div>
              <div className="skeleton" style={{width:"500px", height:"100px", marginBottom:"16px"}}></div>
              <div className="skeleton" style={{width:"100px", height:"18px", marginBottom:"16px"}}></div>
              <div className="skeleton" style={{width:"500px", height:"100px", marginBottom:"16px"}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className={styles.book__wrapper}>
            <figure className={styles.img__wrapper}>
              <img className={styles.book__img} src={book.imageLink} alt={book.title} loading="lazy"/>
            </figure>
            <div className={styles.book__information}>
              <h1 className={styles.book__title}>{book.title}</h1>
              <p className={styles.book__author}>{book.author}</p>
              <h2 className={styles.book__subtitle}>{book.subTitle}</h2>
              <div className={styles.book__details}>
                <ul className={styles.details__list}>
                  <li className={styles.book__detail}>
                    <PiStar className={styles.detail__icon} />
                    <p className={styles.detail__text}>
                      {book.averageRating} ({book.totalRating} ratings)
                    </p>
                  </li>
                  <li className={styles.book__detail}>
                    <PiClock className={styles.detail__icon} />
                    <p className={styles.detail__text}>{formatTime(duration)}</p>
                  </li>
                  <li className={styles.book__detail}>
                    <IoMicOutline className={styles.detail__icon} />
                    <p className={styles.detail__text}>{book.type}</p>
                  </li>
                  <li className={styles.book__detail}>
                    <HiOutlineLightBulb className={styles.detail__icon} />
                    <p className={styles.detail__text}>{book.keyIdeas} Key Ideas</p>
                  </li>
                </ul>
              </div>

              <div className={styles.book__btnsWrapper}>
                <button className={styles.book__btn} onClick={handleReadClick}>
                  <AiOutlineRead className={styles.book__btnIcon} />
                  Read
                </button>
                <button className={styles.book__btn} onClick={handleListenClick}>
                  <IoMicOutline className={styles.book__btnIcon} />
                  Listen
                </button>
              </div>

              <div className={styles.book__mark} onClick={toggleSave}>
                {isSaved ? (
                  <>
                    <FaBookmark className={styles.book__markIcon} />
                    <p className={styles.book__markText}>Saved in My Library</p>
                  </>
                ) : (
                  <>
                    <FaRegBookmark className={styles.book__markIcon} />
                    <p className={styles.book__markText}>Add title to My Library</p>
                  </>
                )}
              </div>
              <h2 className={styles.book__infoTitle}>What's it about?</h2>
              <div className={styles.book__tagsWrapper}>
                {book.tags?.map((tag, i) => (
                  <div key={i} className={styles.book__tag}>
                    <p className={styles.book__tagText}>{tag}</p>
                  </div>
                ))}
              </div>
              <p className={styles.book__info}>{book.bookDescription}</p>
              <h2 className={styles.book__infoTitle}>About the author</h2>
              <p className={styles.book__info}>{book.authorDescription}</p>
            </div>
          </div>
        </div>
      </div>
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          origin="/book[id]"
        />
      )}
    </>
  );
}