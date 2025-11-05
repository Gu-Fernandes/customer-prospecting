"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/services/auth.service";
import { LoginCard } from "./components/login-card";
import { HomeCards } from "./components/home-cards";
import { Loading } from "@/components/loading/loading";

export default function Page() {
  // começa "indefinido" pra server e client baterem
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    // decide de fato no client
    setAuth(isAuthenticated());

    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") {
        setAuth(!!e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);

    const onVis = () => setAuth(isAuthenticated());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center mx-4 justify-center">
      {auth === null ? (
        // enquanto "pensa", mostra o spinner
        <Loading fullScreen={false} label="Carregando..." />
      ) : auth ? (
        <HomeCards />
      ) : (
        <LoginCard onSuccess={() => setAuth(true)} />
      )}
    </main>
  );
}
