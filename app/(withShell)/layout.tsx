"use client";

interface WithShellLayoutProps {
  children: React.ReactNode;
}

import { useState } from "react";
import Sidebar from "../components/sidebar";
import Searchbar from "../components/searchbar";
import Login from "../components/login";
import styles from "./layout.module.css";
import Results from "../components/results";

export default function WithShellLayout({ children }: WithShellLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [search, setSearch] = useState("");
  const [loginOrigin, setLoginOrigin] = useState<string | null>(null);

  return (
    <div className={styles.shell}>
      <div className={styles.sidebarDesktop}>
        <Sidebar onLoginClick={(origin: string) => {
          setLoginOrigin(origin);
          setShowLogin(true);
        }} />
      </div>

      <div
        className={`${styles.sidebarMobile} ${
          mobileOpen ? styles.sidebarMobileOpen : ""
        }`}
      >
        <Sidebar onLoginClick={(origin: string) => {
          setLoginOrigin(origin);
          setShowLogin(true);
        }} />
      </div>

      {mobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={styles.main}>
        <Searchbar
          onHamburgerClick={() => setMobileOpen(true)}
          onSearch={(value) => setSearch(value)}
          search={search}
        />

        {search.trim() !== "" && <Results search={search} />}

        <div className={styles.content}>{children}</div>
      </div>

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          origin={loginOrigin}
        />
      )}
    </div>
  );
}