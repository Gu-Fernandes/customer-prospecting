"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/services/auth.service";
import { LoginCard } from "@/app/components/login-card";
import { HomeCards } from "@/app/components/home-cards";
import { Loading } from "@/components/loading/loading";

export default function Page() {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    setAuth(isAuthenticated());

    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") setAuth(!!e.newValue);
    };
    const onVis = () => {
      if (document.visibilityState === "visible") {
        setAuth(isAuthenticated());
      }
    };

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  if (auth === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Loading label="Carregando..." />
      </div>
    );
  }

  const isLogged = auth === true;

  return (
    <div className="min-h-full grid place-items-center p-4">
      <div className={isLogged ? "w-full max-w-4xl" : "w-full max-w-md"}>
        {isLogged ? (
          <HomeCards />
        ) : (
          <LoginCard onSuccess={() => setAuth(true)} />
        )}
      </div>
    </div>
  );
}
