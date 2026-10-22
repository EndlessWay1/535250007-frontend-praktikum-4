"use client";
import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type DarkModeContextType = {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
};

const DarkModeContext = createContext<DarkModeContextType | null>(null);

function DarkModeProvider({ children }: { children: ReactNode }) {
  // Fixed initial value: identical on server and first client render
  const [isDark, setIsDarkState] = useState(false);

  const setIsDark = useCallback((value: boolean) => {
    setIsDarkState(value);
    document.documentElement.dataset.theme = value ? "dark" : "light";
    try {
      localStorage.setItem("theme", value ? "dark" : "light");
    } catch {}
  }, []);
  // Sync with whatever the inline script in <head> already applied

  useEffect(() => {
    try {
      const theme = localStorage.getItem("theme");
      document.documentElement.dataset.theme = theme
      ? theme
      : document.documentElement.dataset.theme;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDark(
        theme
          ? theme === "dark"
          : document.documentElement.dataset.theme === "dark",
      );
    } catch {}
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export { DarkModeContext, DarkModeProvider };
