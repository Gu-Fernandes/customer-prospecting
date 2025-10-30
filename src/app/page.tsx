"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/services/auth.service";
import { LoginCard } from "./components/login-card";
import { HomeCards } from "./components/home-cards";

export default function Page() {
  const [auth, setAuth] = useState<boolean>(() => isAuthenticated());

  useEffect(() => {
    // atualiza se o token mudar em outra aba
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") setAuth(!!e.newValue);
    };
    window.addEventListener("storage", onStorage);

    // opcional: revalida quando a aba volta a ficar visível
    const onVis = () => setAuth(isAuthenticated());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      {auth ? <HomeCards /> : <LoginCard onSuccess={() => setAuth(true)} />}
    </main>
  );
}
