// src/components/form/field.tsx
"use client";

import { useId } from "react";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/libs/cn";
import { icons } from "@/components/icons";

type Format = "cnpj" | "phone" | "upper";

export type FieldProps<T extends FieldValues = FieldValues> = {
  name: Path<T>; // agora é genérico
  label?: string;
  type?: string;
  placeholder?: string;
  icon?: keyof typeof icons;
  format?: Format;
  className?: string;
};

export function Field<T extends FieldValues = FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  icon,
  format,
  className,
}: FieldProps<T>) {
  const id = useId();
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const Icon = icon ? icons[icon] : null;
  const errMsg = (errors as any)?.[name]?.message as string | undefined;

  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    const el = e.currentTarget;

    if (format === "upper") el.value = el.value.toUpperCase();

    if (format === "cnpj") {
      const d = el.value.replace(/\D/g, "").slice(0, 14);
      let out = d;
      if (d.length > 2) out = `${d.slice(0, 2)}.${d.slice(2)}`;
      if (d.length > 5) out = `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
      if (d.length > 8)
        out = `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(
          8
        )}`;
      if (d.length > 12)
        out = `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(
          8,
          12
        )}-${d.slice(12, 14)}`;
      el.value = out;
    }

    if (format === "phone") {
      const d = el.value.replace(/\D/g, "").slice(0, 11);
      if (!d) return (el.value = "");
      const dd = d.slice(0, 2);
      const r = d.slice(2);
      if (d.length <= 2) el.value = `(${dd}`;
      else if (d.length <= 6) el.value = `(${dd}) ${r}`;
      else if (d.length <= 10)
        el.value = `(${dd}) ${r.slice(0, 4)}-${r.slice(4)}`;
      else el.value = `(${dd}) ${r.slice(0, 5)}-${r.slice(5)}`;
    }
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-zinc-800 dark:text-zinc-100"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...register(name as Path<T>)}
          onInput={handleInput}
          className={cn(
            "w-full rounded-md border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900",
            !Icon && "pl-3",
            errMsg && "border-red-400 focus:border-red-500"
          )}
        />
      </div>

      {errMsg && (
        <p className="text-xs text-red-600 dark:text-red-400">{errMsg}</p>
      )}
    </div>
  );
}
