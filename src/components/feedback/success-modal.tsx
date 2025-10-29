"use client";

import { icons } from "@/components/icons";
import { Button } from "@/components/button/button";
import { cn } from "@/libs/cn";
import Link from "next/link";

type SuccessModalProps = {
  isOpen: boolean;
  companyName: string | null;
  onClose: () => void;
};

export function SuccessModal({
  isOpen,
  companyName,
  onClose,
}: SuccessModalProps) {
  if (!isOpen || !companyName) return null;

  const CheckIcon = icons.circleCheck;
  const XIcon = icons.x;

  return (
    <div
      className={cn(
        // backdrop cobrindo a tela toda
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/40 backdrop-blur-[2px]"
      )}
    >
      {/* caixinha do modal */}
      <div
        className={cn(
          "relative w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-xl"
        )}
      >
        {/* botão fechar no canto superior direito */}
        <button
          onClick={onClose}
          className={cn(
            "absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
          )}
        >
          <XIcon className="h-4 w-4" />
        </button>

        {/* conteúdo principal */}
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
              <CheckIcon className="h-5 w-5 text-green-600 " />
            </div>

            <div className="text-sm leading-relaxed py-2">
              <p className="text-zinc-600 ">
                <span className="font-semibold text-zinc-800">
                  {companyName}
                </span>{" "}
                cadastrado com sucesso!
              </p>
            </div>
          </div>

          {/* ações */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Link href="/prospecting">
              <Button variant="outline">Ver clientes</Button>
            </Link>

            <Button variant="default" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
