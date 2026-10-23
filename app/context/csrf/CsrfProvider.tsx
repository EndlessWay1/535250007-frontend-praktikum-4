"use client";

import { createContext, ReactNode, useEffect } from "react";
import { useLocalStorage } from "../../hook/useLocalStorage";

type CsrfContextType = {
  csrfToken: string;
};

export const CsrfContext = createContext<CsrfContextType | null>(null);

export function CsrfProvider({ children }: { children: ReactNode }) {
  const [csrfToken, setCsrfToken] = useLocalStorage("csrfToken", "");

  useEffect(() => {
    async function getCsrfToken() {
      const response = await fetch("/api/csrf", {
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();
      setCsrfToken(data.csrfToken);
    }

    getCsrfToken();
  }, [setCsrfToken]);

  return (
    <CsrfContext.Provider value={{ csrfToken }}>
      {children}
    </CsrfContext.Provider>
  );
}
