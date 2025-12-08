"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { AuthGuard } from "@/components/auth/auth-guard";
import { Loading } from "@/components/loading/loading";
import { Button } from "@/components/button/button";
import { getCustomers, type Customer } from "@/services/customer.service";
import { isAuthenticated } from "@/services/auth.service";
import { CustomersTable } from "../components/customer/customers-table";

const POLL_INTERVAL = 60_000;

export function ProspectingView() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const loadCustomers = async () => {
      try {
        if (!isAuthenticated()) {
          if (alive) setLoading(false);
          return;
        }

        const result = await getCustomers();
        if (!alive) return;

        setCustomers(result);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (!alive) return;

        setError("Falha ao carregar clientes.");
        setLoading(false);
      }
    };

    loadCustomers();

    const intervalId = setInterval(loadCustomers, POLL_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadCustomers();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      alive = false;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center bg-background text-foreground">
        <Loading label="Carregando..." />
      </div>
    );
  }

  return (
    <AuthGuard fallbackMessage="Faça login para visualizar a lista de clientes.">
      <div className="flex h-full min-h-0 w-full max-w-full flex-col rounded-xl border border-border bg-background text-foreground shadow-lg md:h-auto">
        <header className="shrink-0 px-6 py-4">
          <h1 className="text-xl font-semibold">Prospecção</h1>
          <p className="text-sm text-zinc-600 dark:text-foreground/70">
            Lista de clientes cadastrados e oportunidades.
          </p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-24 md:overflow-visible md:pb-6">
          {error ? (
            <div className="rounded-xl border border-border bg-background p-4 text-sm text-red-500 shadow-sm dark:text-red-300">
              {error}
            </div>
          ) : (
            <CustomersTable
              customers={customers}
              onRowUpdated={(updated) =>
                setCustomers((prev) =>
                  prev.map((c) => (c.id === updated.id ? updated : c))
                )
              }
              onRowDeleted={(id) =>
                setCustomers((prev) => prev.filter((c) => c.id !== id))
              }
            />
          )}
        </div>

        <footer className=" p-3 md:hidden">
          <div className="flex items-center justify-between gap-2">
            <Link href="/customers/new" className="w-1/2">
              <Button variant="outline" className="w-full">
                + Novo Cliente
              </Button>
            </Link>

            <Link href="/" className="w-1/2">
              <Button variant="default" icon="home" className="w-full" />
            </Link>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
