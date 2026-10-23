"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN" | "MODERATOR";
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "same-origin",
          cache: "no-store",
        });

        const result = response.ok ? await response.json() : { user: null };
        if (!cancelled) {
          setUser(result.user);
        }
        console.log(result.user);
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}
