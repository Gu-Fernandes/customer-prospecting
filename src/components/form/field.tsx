// src/components/form/field.tsx
"use client";

import * as React from "react";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { cn } from "@/libs/cn";
import { icons } from "@/components/icons";

type FormatKind = "cnpj" | "phone" | "upper";

type FieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
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

export function Field<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  icon,
  format,
  className,
}: FieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const Icon = icon ? icons[icon] : null;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn("flex flex-col gap-1", className)}>
          {label && (
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-400">
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
              value={(field.value as string) ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const raw = e.target.value;
                const val = format ? formatValue(raw, format) : raw;
                field.onChange(val);
              }}
              placeholder={placeholder}
              className={cn(
                "w-full rounded-md border border-border px-3 py-2 text-sm outline-none",
                " focus:ring-1",
                Icon ? "pl-9" : "",
                fieldState.error ? "" : ""
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
