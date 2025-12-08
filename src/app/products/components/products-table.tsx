"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/button/button";
import { ConfirmDeleteModal } from "@/components/feedback/confirm-delete-modal";
import { deleteProduct, type Product } from "@/services/products.service";

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
  onDeleted?: () => void;
};

export function ProductsTable({ products, onDeleted }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  function openDeleteModal(product: Product) {
    setSelected(product);
    setConfirmOpen(true);
  }

  function closeDeleteModal() {
    if (deleting) return;
    setConfirmOpen(false);
    setSelected(null);
  }

  async function handleConfirmDelete() {
    if (!selected) return;

    try {
      setDeleting(true);
      await deleteProduct(selected.id);

      toast.success("Produto excluído com sucesso.", {
        description: selected.code
          ? `O produto "${selected.code}" foi removido da base.`
          : undefined,
      });

      setConfirmOpen(false);
      setSelected(null);
      onDeleted?.();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);

      const description =
        error instanceof Error && error.message
          ? error.message
          : "Não foi possível excluir o produto. Tente novamente.";

      toast.error("Erro ao excluir produto", { description });
    } finally {
      setDeleting(false);
    }
  }

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
    <>
      <div className="w-full">
        {/* MOBILE: cards */}
        <div className="space-y-3 md:hidden">
          {products.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-border bg-background p-3 shadow-md"
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  {p.code}
                </p>

                <Button
                  type="button"
                  variant="destructive"
                  icon="trash"
                  className="h-8 w-8 px-0"
                  aria-label={`Excluir produto ${p.code}`}
                  onClick={() => openDeleteModal(p)}
                />
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
                <th className="py-2 pr-4 text-right">Ações</th>
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
                  <td className="py-2 pr-4">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        icon="trash"
                        className="h-8 w-8 px-0"
                        aria-label={`Excluir produto ${p.code}`}
                        onClick={() => openDeleteModal(p)}
                      />
                    </div>
                  </td>
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

      {/* Modal de confirmação */}
      <ConfirmDeleteModal
        isOpen={confirmOpen}
        loading={deleting}
        title="Confirmar exclusão do produto"
        message={
          selected
            ? `Tem certeza que deseja excluir o produto "${selected.code}"?`
            : "Tem certeza que deseja excluir este produto?"
        }
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
