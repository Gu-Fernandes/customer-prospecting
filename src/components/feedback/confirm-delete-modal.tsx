"use client";

import { Button } from "@/components/button/button";
import { cn } from "@/libs/cn";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  title?: string;
  message?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDeleteModal({
  isOpen,
  title = "Confirmar exclusão",
  message = "Tem certeza que deseja excluir esse cliente?",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/40 backdrop-blur-[2px]"
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div
        className={cn(
          "relative w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-xl",
          "dark:border-zinc-800 dark:bg-zinc-900"
        )}
      >
        <Button
          variant="icon"
          icon="x"
          iconPosition="only"
          title="Fechar"
          aria-label="Fechar"
          onClick={onCancel}
          className="absolute right-3 top-3"
        />

        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
              <span className="text-red-600 text-base font-bold">!</span>
            </div>

            <div className="py-1">
              <h3
                id="confirm-delete-title"
                className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
              >
                {title}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {message}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>

            <Button
              variant="destructive"
              icon="trash"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
