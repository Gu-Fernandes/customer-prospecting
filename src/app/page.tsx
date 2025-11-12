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
      if (document.visibilityState === "visible") setAuth(isAuthenticated());
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
      <div className="grid h-full min-h-full w-full place-items-center px-3 py-8">
        <div className="w-full max-w-md">
          <Loading label="Carregando..." />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-full w-full place-items-center px-3 py-8">
      <div className="mx-auto w-full max-w-4xl">
        {auth ? <HomeCards /> : <LoginCard onSuccess={() => setAuth(true)} />}
      </div>
    </div>
  );
}
