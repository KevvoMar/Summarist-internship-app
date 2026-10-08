"use client";

import { useAppSelector } from "../redux/hooks";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/authSlice";
import styles from "./sidebar.module.css";
import Link from "next/link";
import { PiHouseLine, PiBookmarkSimple, PiGear, PiQuestion } from "react-icons/pi";
import { RiBallPenLine } from "react-icons/ri";
import { AiOutlineSearch } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAudio } from "../context/audioContext";
import { PiTextAa } from "react-icons/pi";

interface SidebarProps {
  onLoginClick: (origin: string) => void;
}

export default function Sidebar({ onLoginClick }: SidebarProps) {
    const dispatch = useDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const isLoggedIn = Boolean(user);
    const pathname = usePathname();
    const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
    const audio = useAudio();
    const summaryFontSize = audio?.summaryFontSize;
    const setSummaryFontSize = audio?.setSummaryFontSize;
    const isPlayerPage = pathname.startsWith("/player/");

    const handleLogout = async () => {
        await signOut(auth);
        dispatch(clearUser());
        };
    
    return (
        <>
            <div className={sidebarOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar}>
                <div className={styles.side__wrapper}>
                    <figure className={styles.side__imgMask}>
                        <Link href="/">
                            <img className={styles.side__img} src="/assets/logo.png" alt="logo" />
                        </Link>
                    </figure>
                    <ul className={`${styles["side__list"]} ${styles["side__listTop"]}`}>
                        <Link href="/for-you">
                            <li className={`${styles["side__item"]} ${styles["clickable"]}`}>
                                <div className={`${styles.active__line} ${
                                pathname === "/for-you" ? styles.active : ""
                                }`}></div>
                                <PiHouseLine className={styles.side__icon}/>
                                <p className={styles.item__name}>For you</p>
                            </li>
                        </Link>
                        <Link href="/library">
                            <li className={`${styles["side__item"]} ${styles["clickable"]}`}>
                                <div className={`${styles.active__line} ${
                                pathname === "/library" ? styles.active : ""
                                }`}></div>
                                <PiBookmarkSimple className={styles.side__icon}/>
                                <p className={styles.item__name}>My Library</p>
                            </li>
                        </Link>
                        <li className={`${styles["side__item"]} ${styles["not__clickable"]}`}>
                            <div className={styles.active__line}></div>
                            <RiBallPenLine className={styles.side__icon}/>
                            <p className={styles.item__name}>Highlights</p>
                        </li>
                        <li className={`${styles["side__item"]} ${styles["not__clickable"]}`}>
                            <div className={styles.active__line}></div>
                            <AiOutlineSearch className={styles.side__icon}/>
                            <p className={styles.item__name}>Search</p>
                        </li>
                        {isPlayerPage && (
                            <li className={styles.fontSizeController}>
                                <div className={styles.fontSizeOptions}>
                                    <button
                                    className={`${styles.size__button} ${summaryFontSize === "14px" ? styles.selected : ""}`}
                                    onClick={() => setSummaryFontSize("14px")}
                                    >
                                        <PiTextAa className={styles.size__s}/>
                                    </button>

                                    <button
                                    className={`${styles.size__button} ${summaryFontSize === "16px" ? styles.selected : ""}`}
                                    onClick={() => setSummaryFontSize("16px")}
                                    >
                                        <PiTextAa className={styles.size__m}/>
                                    </button>

                                    <button
                                    className={`${styles.size__button} ${summaryFontSize === "20px" ? styles.selected : ""}`}
                                    onClick={() => setSummaryFontSize("20px")}
                                    >
                                        <PiTextAa className={styles.size__l}/>
                                    </button>

                                    <button
                                    className={`${styles.size__button} ${summaryFontSize === "24px" ? styles.selected : ""}`}
                                    onClick={() => setSummaryFontSize("24px")}
                                    >
                                        <PiTextAa className={styles.size__xl}/>
                                    </button>
                                </div>
                            </li>
                        )}
                    </ul>
                    <ul className={`${styles["side__list"]} ${styles["side__listBottom"]}`}>
                    <Link href="/settings">
                            <li className={`${styles["side__item"]} ${styles["clickable"]}`}>
                                <div className={`${styles.active__line} ${
                                pathname === "/settings" ? styles.active : ""
                                }`}></div>
                                <PiGear className={styles.side__icon}/>
                                <p className={styles.item__name}>Settings</p>
                            </li>
                        </Link>
                        <li className={`${styles["side__item"]} ${styles["not__clickable"]}`}>
                            <div className={styles.active__line}></div>
                            <PiQuestion className={styles.side__icon}/>
                            <p className={styles.item__name}>Help & Support</p>
                        </li>
                        
                        {isLoggedIn ? (
                        <li 
                        className={`${styles["side__item"]} ${styles["clickable"]}`}
                        onClick={handleLogout}
                        >
                            <div className={styles.active__line}></div>
                            <MdLogout className={styles.side__icon}/>
                            <p className={styles.item__name}>Logout</p>
                        </li>
                        ) : (
                        <li 
                        className={`${styles["side__item"]} ${styles["clickable"]}`}
                        onClick={() => onLoginClick(pathname)}
                        >
                            <div className={styles.active__line}></div>
                            <MdLogout className={styles.side__icon}/>
                            <p className={styles.item__name}>Login</p>
                        </li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
}