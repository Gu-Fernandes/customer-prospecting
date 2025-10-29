"use client";

import Link from "next/link";
import { Button } from "@/components/button/button";
import { icons } from "@/components/icons";
import { type Customer } from "@/services/customer.service";

interface CustomersTableProps {
  customers: Customer[];
}

// força maiúsculo, evitando crash se vier null/undefined
function upper(v: string | undefined | null) {
  return (v ?? "").toUpperCase();
}

/**
 * Formata o CNPJ para o padrão:
 * 00.000.000/0000-00
 */
function formatCNPJDisplay(raw: string | undefined | null) {
  if (!raw) return "";

  const digits = raw.replace(/\D/g, "").slice(0, 14);

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
      5,
      8
    )}/${digits.slice(8)}`;

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
    5,
    8
  )}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

/**
 * Formata telefone brasileiro:
 * (11) 91234-5678  (11 dígitos)
 * (11) 1234-5678   (10 dígitos)
 */
function formatPhoneDisplay(raw: string | undefined | null) {
  if (!raw) return "";

  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  if (digits.length <= 2) {
    return `(${ddd}`;
  }

  if (digits.length <= 6) {
    return `(${ddd}) ${rest}`;
  }

  if (digits.length <= 10) {
    // fixo: 4 + 4
    return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }

  // celular: 5 + 4
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const HomeIcon = icons.home;

  if (customers.length === 0) {
    return (
      <div className="text-sm text-zinc-500">
        Nenhum cliente cadastrado ainda.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-[11px] font-medium uppercase text-zinc-500">
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

          <tbody className="text-sm text-zinc-800 ">
            {customers.map((c) => (
              <tr
                key={c.id}
                className="border-b border-zinc-100 hover:bg-zinc-50"
              >
                <td className="py-2 pr-4 font-medium text-zinc-900">
                  {c.company}
                </td>

                <td className="py-2 pr-4">{formatCNPJDisplay(c.cnpj)}</td>

                <td className="py-2 pr-4">{c.responsible}</td>

                <td className="py-2 pr-4">{formatPhoneDisplay(c.phone)}</td>

                <td className="py-2 pr-4">{c.email}</td>

                <td className="py-2 pr-4 font-medium">
                  {upper(c.main_product)}
                </td>

                <td className="py-2 pr-4 font-mono tracking-wide">
                  {upper(c.sku)}
                </td>

                <td className="py-2 pr-4">{c.supplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* botão alinhado à direita */}
      <div className="mt-4 gap-2 flex w-full justify-between">
        <Link href="/customers/new">
          <Button variant="outline">+ Novo Cliente</Button>
        </Link>
        <Link href="/">
          <Button variant="default">
            <HomeIcon className="h-4 w-4 " />
          </Button>
        </Link>
      </div>
    </div>
  );
}
