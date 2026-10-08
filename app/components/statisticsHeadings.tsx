"use client";

interface StatisticsHeadingsProps {
  items: string[];
}

import { useEffect, useState } from "react";
import styles from "./statistics.module.css";

export default function StatisticsHeadings({ items }: StatisticsHeadingsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div>
      {items.map((text, i) => (
        <div
          key={i}
          className={
            i === activeIndex
              ? `${styles.statistics__heading} ${styles.statistics__headingActive}`
              : styles.statistics__heading
          }
        >
          {text}
        </div>
      ))}
    </div>
  );
}
