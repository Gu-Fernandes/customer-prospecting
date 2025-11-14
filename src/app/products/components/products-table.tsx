"use client";

import Link from "next/link";
import { Button } from "@/components/button/button";
import { Product } from "@/services/products.service";

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

type Props = {
  products: Product[];
};

export function ProductsTable({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-sm text-zinc-500 dark:text-foreground/70">
        Nenhum produto cadastrado ainda.
        <div className="mt-4 hidden w-full items-center justify-between gap-3 md:flex">
          <Link href="/products/new">
            <Button variant="outline" className="w-full sm:w-auto">
              + Novo Produto
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="default"
              icon="home"
              className="w-full sm:w-auto"
            />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* MOBILE: cards */}
      <div className="space-y-3 md:hidden">
        {products.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-border bg-background p-3 shadow-md"
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{p.code}</p>
            </div>
            <p className="text-xs text-zinc-500 dark:text-foreground/60">
              Criado em: {fmtDate(p.created_at)}
            </p>
          </div>
        ))}
      </div>

      {/* DESKTOP: tabela */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-[520px] w-full border-collapse">
          <thead>
            <tr className="border-b border-border text-left text-[11px] font-medium uppercase text-zinc-500 dark:text-foreground/50">
              <th className="py-2 pr-4">Código</th>
              <th className="py-2 pr-4">Criado em</th>
            </tr>
          </thead>
          <tbody className="text-sm text-zinc-800 dark:text-foreground">
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-zinc-100 hover:bg-zinc-50 dark:border-border/40 dark:hover:bg-background/40"
              >
                <td className="py-2 pr-4 font-medium">{p.code}</td>
                <td className="py-2 pr-4">{fmtDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Ações (desktop) */}
        <div className="mt-4 flex w-full items-center justify-between gap-2">
          <Link href="/products/new">
            <Button variant="outline" className="w-full sm:w-auto">
              + Novo Produto
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="default"
              icon="home"
              className="w-full sm:w-auto"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
