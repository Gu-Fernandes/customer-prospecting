// src/components/form/field.tsx
"use client";

import * as React from "react";
import { Controller, useFormContext, type FieldValues } from "react-hook-form";
import { cn } from "@/libs/cn";
import { icons } from "@/components/icons";

type KnownNames =
  | "email"
  | "phone"
  | "company"
  | "cnpj"
  | "responsible"
  | "main_product"
  | "sku"
  | "supplier"
  | "password";

type FormatKind = "cnpj" | "phone" | "upper";

type Props<TFieldValues extends FieldValues = Record<KnownNames, string>> = {
  name: KnownNames;
  label?: string;
  placeholder?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  icon?: keyof typeof icons;
  format?: FormatKind;
  className?: string;
};

function formatValue(v: string, kind?: FormatKind): string {
  if (!kind) return v;
  if (kind === "upper") return v.toUpperCase();

  if (kind === "cnpj") {
    const d = v.replace(/\D/g, "").slice(0, 14);
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
    if (d.length <= 12)
      return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(
      8,
      12
    )}-${d.slice(12, 14)}`;
  }

  if (kind === "phone") {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (!d) return "";
    const dd = d.slice(0, 2);
    const r = d.slice(2);
    if (d.length <= 2) return `(${dd}`;
    if (d.length <= 6) return `(${dd}) ${r}`;
    if (d.length <= 10) return `(${dd}) ${r.slice(0, 4)}-${r.slice(4)}`;
    return `(${dd}) ${r.slice(0, 5)}-${r.slice(5)}`;
  }

  return v;
}

export function Field<
  TFieldValues extends FieldValues = Record<KnownNames, string>
>({
  name,
  label,
  placeholder,
  type = "text",
  icon,
  format,
  className,
}: Props<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const Icon = icon ? icons[icon] : null;

  return (
    <Controller
      name={name as any} // o nome é restrito; RHF aceita string
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn("flex flex-col gap-1", className)}>
          {label && (
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {label}
            </label>
          )}

          <div className="relative">
            {Icon && (
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <Icon className="h-4 w-4" />
              </span>
            )}

            <input
              {...field}
              type={type}
              value={field.value ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const raw = e.target.value;
                const val = format ? formatValue(raw, format) : raw;
                field.onChange(val);
              }}
              placeholder={placeholder}
              className={cn(
                "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none",
                "focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300",
                Icon ? "pl-9" : "",
                fieldState.error
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : ""
              )}
            />
          </div>

          {fieldState.error && (
            <span className="text-xs text-red-600">
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
}
