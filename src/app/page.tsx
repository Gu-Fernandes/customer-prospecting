// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/services/auth.service";
import { HomeCards } from "./components/home-cards";
import { LoginCard } from "./components/login-card";

export default function Home() {
  const [auth, setAuth] = useState<null | boolean>(null);

  useEffect(() => {
    setAuth(isAuthenticated());
    // atualizar quando o login acontecer em outra aba/janela
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") setAuth(!!e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (auth === null) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-zinc-500">Carregando…</div>
      </main>
    );
  }

  if (!auth) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <LoginCard onSuccess={() => setAuth(true)} />
      </main>
    );
  }

  // já autenticado → render padrão
  return (
    <main className="flex min-h-screen items-center justify-center">
      <HomeCards />
    </main>
  );
}
