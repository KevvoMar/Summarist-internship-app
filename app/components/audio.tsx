"use client";

import { useAppSelector } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { updateLibraryFinished } from "../redux/authSlice";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useRef, useState, useEffect } from "react";
import styles from "./audio.module.css";
import { GrBackTen, GrForwardTen } from "react-icons/gr";
import { IoPlayCircleSharp, IoPauseCircleSharp } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
import { useAudio } from "../context/audioContext";

export default function AudioPlayer() {
  const { book } = useAudio();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!book) return;

    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setDur = () => {
      setDuration(audio.duration);
      setLoading(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setDur);

    if (audio.readyState >= 1) {
      setDuration(audio.duration);
      setLoading(false);
    }

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setDur);
    };
  }, [book]);

  const playAudio = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const skipForward = () => {
    if (audioRef.current) audioRef.current.currentTime += 10;
  };

  const skipBackward = () => {
    if (audioRef.current) audioRef.current.currentTime -= 10;
  };

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  async function handleFinished() {
    if (!user || !book) return;

    const userRef = doc(db, "users", user.uid);

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

    await updateDoc(userRef, {
      libraryFinished: arrayUnion(bookData)
    });

    dispatch(updateLibraryFinished({
      type: "add",
      book: bookData
    }));
  }

  if (!book) {
    return (
      <>
        <section className={styles.audio__player}>
          <div className={styles.audio__description}>
            <div className="skeleton" style={{width:"40px", height:"40px", marginLeft:"32px"}}></div>
            <div className={styles.audio__bookDetails}>
              <div className="skeleton" style={{width:"60px", height:"16px"}}></div>
              <div className="skeleton" style={{width:"88px", height:"16px"}}></div>
            </div>
          </div>
          <div className={styles.audio__controls}>
            <button className={styles.audio__backwardTen}>
              <GrBackTen />
            </button>
            <button className={styles.audio__play}>
              <IoPlayCircleSharp />
            </button> 
            <button className={styles.audio__pause}>
              <IoPauseCircleSharp />
            </button>
            <button className={styles.audio__forwardTen}>
              <GrForwardTen />
            </button>
          </div>
          <div className={styles.audio__duration}>
            <p className={styles.audio__played}>00:00</p>
            <div className={styles.audio__bar}>
              <FaCircle className={styles.audio__circle}/>
            </div>
            <p className={styles.audio__left}>00:00</p>
          </div>
        </section>
      </>
    )
  }

  return (
    <section className={styles.audio__player}>
      <audio
        ref={audioRef}
        src={book.audioLink}
        onEnded={handleFinished}
      />
      <div className={styles.audio__description}>
        <img
          className={styles.audio__img}
          src={book.imageLink}
          alt={book.title}
          loading="lazy"
        />
        <div className={styles.audio__bookDetails}>
          <h1 className={styles.audio__title}>{book.title}</h1>
          <h2 className={styles.audio__author}>{book.author}</h2>
        </div>
      </div>
      
      <div className={styles.audio__controls}>
        <button onClick={skipBackward} className={styles.audio__backwardTen}>
          <GrBackTen />
        </button>
        {!isPlaying ? (
          <button onClick={playAudio} className={styles.audio__play}>
            <IoPlayCircleSharp />
          </button>
        ) : (
          <button onClick={pauseAudio} className={styles.audio__pause}>
            <IoPauseCircleSharp />
          </button>
        )}
        <button onClick={skipForward} className={styles.audio__forwardTen}>
          <GrForwardTen />
        </button>
      </div>

      <div className={styles.audio__duration}>
        <p className={styles.audio__played}>{formatTime(currentTime)}</p>

        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          step="0.1"
          className={styles.audio__slider}
          style={{ "--progress-percent": `${progressPercent}%` } as React.CSSProperties}
          onChange={(e) => {
            const newTime = Number(e.target.value);
            if (audioRef.current) audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
          }}
        />
        <p className={styles.audio__left}>
          {formatTime(duration - currentTime)}
        </p>
      </div>
    </section>
  );
}