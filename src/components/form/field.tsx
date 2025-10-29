"use client";

import { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";

import type { CustomerFormValues } from "@/schemas/customer-form-schema";
import { TextInput } from "@/components/input/input";
import { cn } from "@/libs/cn";
import { icons, type IIcons } from "@/components/icons";

type MaskKind = "cnpj" | "phone" | "upper";

export interface FieldProps {
  name: keyof CustomerFormValues;
  label: string;
  placeholder?: string;
  type?: string;
  format?: MaskKind; // "cnpj" | "phone" | "upper"
  icon: IIcons; // "building", "phone", etc
  className?: string;
}

/* --- Máscaras / transformações --- */

// 12.345.678/0001-90
function maskCNPJ(raw: string): string {
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

// (11) 91234-5678 / (11) 1234-5678
function maskPhone(raw: string): string {
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
    return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }

  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

function toUpper(raw: string): string {
  return raw.toUpperCase();
}

export function Field({
  name,
  label,
  placeholder,
  type = "text",
  format,
  icon,
  className,
}: FieldProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CustomerFormValues>();

  // valor atual reativo daquele campo
  const value = watch(name) ?? "";

  // só queremos o ref e o onBlur do RHF
  const { ref, onBlur } = register(name);

  // decide qual função de máscara/transf usar com base em `format`
  const applyMask = useMemo(() => {
    if (format === "cnpj") return maskCNPJ;
    if (format === "phone") return maskPhone;
    if (format === "upper") return toUpper;
    return null;
  }, [format]);

  // onChange controlado: aplica máscara / upper e joga no RHF
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const nextValue = applyMask ? applyMask(raw) : raw;

      setValue(name, nextValue, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false, // valida depois no submit
      });
    },
    [applyMask, name, setValue]
  );

  const fieldError = errors[name]?.message as string | undefined;

  // transforma a string `icon` em componente real
  const IconComponent = icons[icon];
  const iconNode = (
    <IconComponent className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
  );

  return (
    <div className={cn("", className)}>
      <TextInput
        label={label}
        id={name}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        ref={ref}
        error={fieldError}
        icon={iconNode}
      />
    </div>
  );
}
