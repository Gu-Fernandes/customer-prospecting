// src/app/prospecting/prospecting-view.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { getCustomers, type Customer } from "@/services/customer.service";
import { CustomersTable } from "../components/customer/customers-table";
import { AuthGuard } from "@/components/auth/auth-guard";

export function ProspectingView() {
  return (
    <AuthGuard fallbackMessage="Faça login para visualizar a lista de clientes.">
      <ProspectingInner />
    </AuthGuard>
  );
}

function ProspectingInner() {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const result = await getCustomers();
        if (alive) setData(result);
      } catch (err) {
        console.error(err);
        if (alive) setError("Falha ao carregar clientes.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const handleRowUpdated = useCallback((updated: Customer) => {
    setData((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  const handleRowDeleted = useCallback((id: string) => {
    setData((prev) => prev.filter((c) => c.id !== id));
  }, []);

  if (loading) {
    return (
      <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Carregando...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-sm text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
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
        customers={data}
        onRowUpdated={handleRowUpdated}
        onRowDeleted={handleRowDeleted}
      />
    </div>
  );
}
