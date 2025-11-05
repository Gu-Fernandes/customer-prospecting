"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Loading } from "@/components/loading/loading";
import { getCustomers, type Customer } from "@/services/customer.service";
import { CustomersTable } from "../components/customer/customers-table";
import { isAuthenticated } from "@/services/auth.service";

const POLL_INTERVAL = 60_000;

export function ProspectingView() {
  const isBrowser = typeof window !== "undefined";

  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return isAuthenticated();
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchCustomers() {
    try {
      const result = await getCustomers();
      setCustomers(result);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Falha ao carregar clientes.");
    }
  }

  useEffect(() => {
    if (!isBrowser) return;

    const hasToken = isAuthenticated();
    if (!hasToken) {
      // loading já foi definido no estado inicial
      return;
    }

    let alive = true;

    (async () => {
      await fetchCustomers();
      if (alive) {
        setLoading(false);
      }
    })();

    const interval = setInterval(() => {
      fetchCustomers();
    }, POLL_INTERVAL);

    const onVis = () => {
      if (document.visibilityState === "visible") {
        fetchCustomers();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [isBrowser]);

  if (!isBrowser || loading) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center bg-background text-foreground">
        <Loading label="Carregando..." />
      </div>
    );
  }

  return (
    <AuthGuard fallbackMessage="Faça login para visualizar a lista de clientes.">
      {error ? (
        <div className="w-full rounded-xl border border-border bg-background p-6 shadow-lg">
          <div className="text-sm text-red-500 dark:text-red-300">{error}</div>
        </div>
      ) : (
        <div className="w-full max-w-full rounded-xl border border-border bg-background p-6 shadow-lg text-foreground">
          <header className="mb-4">
            <h1 className="text-xl font-semibold">Prospecção</h1>
            <p className="text-sm text-zinc-600 dark:text-foreground/70">
              Lista de clientes cadastrados e oportunidades.
            </p>
          </header>

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
        </div>
      )}
    </AuthGuard>
  );
}
