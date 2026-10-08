interface NavbarProps {
  onLoginClick: (origin: string) => void;
}

import styles from "./navbar.module.css";
import Link from "next/link";

export default function Navbar({ onLoginClick }: NavbarProps) {

    return (
        <nav className={styles.nav}>
            <div className={styles.nav__wrapper}>
            <figure className={styles.nav__imgMask}>
                <Link href="/">
                    <img className={styles.nav__img} src="/assets/logo.png" alt="logo" />
                </Link>
            </figure>
            <ul className={styles.nav__listWrapper}>
                <li className={`${styles["nav__list"]} ${styles["nav__listLogin"]}`}
                    onClick={() => onLoginClick("/")}>Login</li>
                <li className={`${styles["nav__list"]} ${styles["nav__listMobile"]}`}>About</li>
                <li className={`${styles["nav__list"]} ${styles["nav__listMobile"]}`}>Contact</li>
                <li className={`${styles["nav__list"]} ${styles["nav__listMobile"]}`}>Help</li>
            </ul>
            </div>
        </nav>
    )
}