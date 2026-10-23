"use client";
import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial); // never read storage here

  useEffect(() => {
    try {
      const s = localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (s !== null) setValue(JSON.parse(s));
    } catch {}
  }, [key]);

  const set = useCallback(
    (v: T) => {
      setValue(v);
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch (e) {
        console.error(e);
      }
    },
    [key],
  );

  return [value, set] as const;
}
