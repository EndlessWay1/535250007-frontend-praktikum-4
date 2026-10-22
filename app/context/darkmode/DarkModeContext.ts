// context/DarkModeContext.tsx
"use client"
import { useContext } from "react";
import { DarkModeContext } from "./DarkModeProvider";



export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx)
    throw new Error("useDarkMode must be used inside a DarkModeProvider");
  return ctx;
}
