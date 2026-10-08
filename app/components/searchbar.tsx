"use client";

import styles from "./searchbar.module.css";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { VscThreeBars } from "react-icons/vsc";

interface SearchbarProps {
  onSearch: (value: string) => void;
  onHamburgerClick: () => void;
  search: string;
}

export default function Searchbar({ onSearch, onHamburgerClick, search }: SearchbarProps) {
  return (
    <>
      <div className={styles.searchbar}>
        <div className={styles.search__wrapper}>
          <input 
          className={styles.search__input}
          placeholder="Search for books"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          />
          {search.trim() === "" ? (
            <AiOutlineSearch className={styles.icon}/>
          ) : (
            <button
              className={styles.clearButton}
              onClick={() => onSearch("")}
            >
              <AiOutlineClose className={styles.icon} />
            </button>
          )}
        </div>
        <button className={styles.hamburger} onClick={onHamburgerClick}>
          <VscThreeBars className={styles.hamburger__icon}/>
        </button>
      </div>
    </>
  )
}