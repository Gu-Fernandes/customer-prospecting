"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/services/auth.service";
import { LoginCard } from "@/app/components/login-card";
import { HomeCards } from "@/app/components/home-cards";

export default function Page() {
  const [auth, setAuth] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return isAuthenticated();
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") {
        setAuth(!!e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);

    const onVis = () => {
      if (document.visibilityState === "visible") {
        setAuth(isAuthenticated());
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center mx-3 justify-center">
      {auth ? <HomeCards /> : <LoginCard onSuccess={() => setAuth(true)} />}
    </main>
  );
}
