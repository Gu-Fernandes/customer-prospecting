"use client";

import Link from "next/link";

import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/button/button";
import { Loading } from "@/components/loading/loading";

import { useProducts } from "./hooks/use-products";
import { ProductsTable } from "./components/products-table";

export function ProductsView() {
  const { loading, products, error, reload } = useProducts();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Loading label="Carregando..." />
      </div>
    );
  }

  return (
    <AuthGuard fallbackMessage="Faça login para visualizar a lista de produtos.">
      {error ? (
        <div className="w-full rounded-xl border border-border bg-background p-6 shadow-lg">
          <p className="text-sm text-red-500 dark:text-red-300">{error}</p>

          <div className="mt-3">
            <Button variant="outline" onClick={reload}>
              Tentar novamente
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex h-full min-h-0 w-full max-w-full flex-col rounded-xl border border-border bg-background text-foreground shadow-lg md:h-auto">
          <header className="shrink-0 px-6 py-4">
            <h1 className="text-xl font-semibold">Produtos</h1>
            <p className="text-sm text-zinc-600 dark:text-foreground/70">
              Base de produtos cadastrados.
            </p>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-24 md:overflow-visible md:pb-6">
            <ProductsTable products={products} onDeleted={reload} />
          </div>

          <div className="bg-background p-3 md:hidden">
            <div className="flex items-center justify-between gap-2">
              <Link href="/products/new" className="w-1/2">
                <Button variant="outline" className="w-full">
                  + Novo Produto
                </Button>
              </Link>

              <Link href="/" className="w-1/2">
                <Button variant="default" icon="home" className="w-full" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
