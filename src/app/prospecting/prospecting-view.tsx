"use client";

import { useEffect, useState } from "react";
import { getCustomers, type Customer } from "@/services/customer.service";
import { CustomersTable } from "../components/customer/customers-table";

export function ProspectingView() {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await getCustomers();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Falha ao carregar clientes.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="w-full max-w-6xl rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Prospecção
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Lista de clientes cadastrados e oportunidades.
        </p>
      </header>

      {loading ? (
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Carregando...
        </div>
      ) : error ? (
        <div className="text-sm text-red-500 dark:text-red-400">{error}</div>
      ) : (
        <CustomersTable customers={data} />
      )}
    </div>
  );
}
