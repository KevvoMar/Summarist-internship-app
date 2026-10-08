"use client";

import { createContext, useContext, useState } from "react";

interface AudioContextType {
  book: any | null;
  setBook: (book: any | null) => void;
  summaryFontSize: string;
  setSummaryFontSize: (size: string) => void;
}

const AudioContext = createContext<AudioContextType>({
  book: null,
  setBook: () => {},
  summaryFontSize: "16px",
  setSummaryFontSize: () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [book, setBook] = useState<any | null>(null);
  const [summaryFontSize, setSummaryFontSize] = useState("16px");

  return (
    <AudioContext.Provider value={{ book, setBook, summaryFontSize, setSummaryFontSize }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}