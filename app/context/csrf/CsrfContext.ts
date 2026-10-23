// context/DarkModeContext.tsx
"use client";
import { useContext } from "react";
import { CsrfContext } from "./CsrfProvider";

export function useCsrf() {
  const ctx = useContext(CsrfContext);
  if (!ctx) throw new Error("useCsrf must be used inside a CsrfProvider");
  return ctx;
}
