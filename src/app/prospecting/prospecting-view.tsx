"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getCustomers, type Customer } from "@/services/customer.service";
import { CustomersTable } from "../components/customer/customers-table";
import { Button } from "@/components/button/button";

/** Hook simples para ler o token e reagir a mudanças do localStorage */
function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const read = () => setToken(localStorage.getItem("access_token"));
    read();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return token;
}

export function ProspectingView() {
  const token = useAuthToken();

  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(!!token); // só carrega se tiver token
  const [error, setError] = useState<string | null>(null);

  // Carrega clientes quando houver token
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setData([]);
      return;
    }

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getCustomers();
        if (alive) setData(result);
      } catch (err: unknown) {
        console.error(err);
        if (alive) setError("Falha ao carregar clientes.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [token]);

  const handleRowUpdated = useCallback((updated: Customer) => {
    setData((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  const handleRowDeleted = useCallback((id: string) => {
    setData((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Guard: sem token → mensagem de login
  if (!token) {
    return (
      <div className="w-full max-w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <header className="mb-4">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Prospecção
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Para visualizar a lista de clientes é necessário estar logado.
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

  // Loading
  if (loading) {
    return (
      <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Carregando...
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-sm text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  // Lista
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
