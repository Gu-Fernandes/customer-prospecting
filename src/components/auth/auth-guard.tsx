"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isAuthenticated } from "@/utils/auth";
import { Button } from "@/components/button/button";

type Props = {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
};

export function AuthGuard({
  children,
  fallbackTitle = "Não autorizado",
  fallbackMessage = "É necessário estar logado para acessar esta seção.",
}: Props) {
  const [ok, setOk] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") setOk(isAuthenticated());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!ok) {
    return (
      <div className="w-full max-w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <header className="mb-4">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {fallbackTitle}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {fallbackMessage}
          </p>
        </header>
        <div className="flex items-center justify-end gap-2">
          <Link href="/">
            <Button variant="outline" icon="home">
              Início
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="default">Ir para login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
