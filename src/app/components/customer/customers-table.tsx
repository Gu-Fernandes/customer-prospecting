"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/button/button";
import { type Customer } from "@/services/customer.service";
import { EditCustomerModal } from "./edit-customer-modal";
import { useDisclosure } from "@/hooks/use-disclosure";
import {
  upper,
  formatCNPJDisplay,
  formatPhoneDisplay,
} from "@/utils/formatters";

interface CustomersTableProps {
  customers: Customer[];
  onRowUpdated?: (c: Customer) => void;
  onRowDeleted?: (id: string) => void;
}

export function CustomersTable({
  customers,
  onRowUpdated,
  onRowDeleted,
}: CustomersTableProps) {
  const { isOpen, open, close } = useDisclosure(false);
  const [selected, setSelected] = useState<Customer | null>(null);

  function handleOpenEdit(c: Customer) {
    setSelected(c);
    open();
  }
  function handleCloseEdit() {
    close();
    setSelected(null);
  }

  if (customers.length === 0) {
    return (
      <div className="text-sm text-zinc-500">
        Nenhum cliente cadastrado ainda.
        <div className="mt-4 flex w-full items-center justify-between gap-3">
          <Link href="/customers/new">
            <Button variant="outline" className="w-full sm:w-auto">
              + Novo Cliente
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
      <EditCustomerModal
        isOpen={isOpen}
        customer={selected}
        onClose={handleCloseEdit}
        onUpdated={(updated) => {
          handleCloseEdit();
          onRowUpdated?.(updated);
        }}
        onDeleted={(id) => {
          handleCloseEdit();
          onRowDeleted?.(id);
        }}
      />

      {/* MOBILE: cards */}
      <div className="space-y-3 md:hidden">
        {customers.map((c) => (
          <div
            key={c.id}
            className="rounded-lg border border-zinc-200 bg-white p-3 shadow-md"
          >
            <div className="mb-2 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {c.company}
                </p>
                <p className="text-xs text-zinc-500">
                  {formatCNPJDisplay(c.cnpj)}
                </p>
              </div>
              <Button
                variant="icon"
                size="sm"
                icon="pencil"
                iconPosition="only"
                aria-label={`Editar ${c.company}`}
                onClick={() => handleOpenEdit(c)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-zinc-400">Responsável</p>
                <p className="text-zinc-700">{c.responsible}</p>
              </div>
              <div>
                <p className="text-zinc-400">Telefone</p>
                <p className="text-zinc-700">{formatPhoneDisplay(c.phone)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-zinc-400">E-mail</p>
                <p className="text-zinc-700 break-all">{c.email}</p>
              </div>
              <div>
                <p className="text-zinc-400">Produto</p>
                <p className="text-zinc-700">
                  {c.main_product ? upper(c.main_product) : "—"}
                </p>
              </div>
              <div>
                <p className="text-zinc-400">SKU</p>
                <p className="text-zinc-700">{c.sku ? upper(c.sku) : "—"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-zinc-400">Fornecedor</p>
                <p className="text-zinc-700">{c.supplier || "—"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP: tabela */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-[11px] font-medium uppercase text-zinc-500">
              <th className="w-10 py-1 pr-1" />
              <th className="py-2 pr-4">Empresa</th>
              <th className="py-2 pr-4">CNPJ</th>
              <th className="py-2 pr-4">Responsável</th>
              <th className="py-2 pr-4">Telefone</th>
              <th className="py-2 pr-4">E-mail</th>
              <th className="py-2 pr-4">Produto</th>
              <th className="py-2 pr-4">SKU</th>
              <th className="py-2 pr-4">Fornecedor</th>
            </tr>
          </thead>

          <tbody className="text-sm text-zinc-800">
            {customers.map((c) => (
              <tr
                key={c.id}
                className="border-b border-zinc-100 hover:bg-zinc-50"
              >
                <td className="py-2 pr-2">
                  <Button
                    variant="icon"
                    size="sm"
                    icon="pencil"
                    iconPosition="only"
                    aria-label={`Editar ${c.company}`}
                    title={`Editar ${c.company}`}
                    onClick={() => handleOpenEdit(c)}
                  />
                </td>

                <td className="py-2 pr-4 font-medium text-zinc-900">
                  {c.company}
                </td>
                <td className="py-2 pr-4">{formatCNPJDisplay(c.cnpj)}</td>
                <td className="py-2 pr-4">{c.responsible}</td>
                <td className="py-2 pr-4">{formatPhoneDisplay(c.phone)}</td>
                <td className="py-2 pr-4">{c.email}</td>
                <td className="py-2 pr-4 font-medium">
                  {c.main_product ? upper(c.main_product) : "—"}
                </td>
                <td className="py-2 pr-4 font-mono tracking-wide">
                  {c.sku ? upper(c.sku) : "—"}
                </td>
                <td className="py-2 pr-4">{c.supplier || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/customers/new">
          <Button variant="outline" className="w-full sm:w-auto">
            + Novo Cliente
          </Button>
        </Link>
        <Link href="/">
          <Button variant="default" icon="home" className="w-full sm:w-auto" />
        </Link>
      </div>
    </div>
  );
}
