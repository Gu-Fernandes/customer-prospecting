"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Loading } from "@/components/loading/loading";
import { getCustomers, type Customer } from "@/services/customer.service";
import { CustomersTable } from "../components/customer/customers-table";
import { isAuthenticated } from "@/services/auth.service";

export function ProspectingView() {
  const isBrowser = typeof window !== "undefined";

  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isBrowser) return;

    const hasToken = isAuthenticated();

    if (!hasToken) {
      setLoading(false);
      return;
    }

    let alive = true;

    (async () => {
      try {
        const result = await getCustomers();
        if (alive) {
          setCustomers(result);
        }
      } catch (err) {
        console.error(err);
        if (alive) {
          setError("Falha ao carregar clientes.");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [isBrowser]);

  if (!isBrowser || loading) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center">
        <Loading label="Carregando..." />
      </div>
    );
  }

  return (
    <AuthGuard fallbackMessage="Faça login para visualizar a lista de clientes.">
      {error ? (
        <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm text-red-500 dark:text-red-400">{error}</div>
        </div>
      ) : (
        <div className="w-full max-w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <header className="mb-4">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Prospecção
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
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
