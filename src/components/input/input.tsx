"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/libs/cn";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
  error?: string;
  className?: string;
  id?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, icon, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {/* label */}
        <label htmlFor={id} className="text-sm">
          {label}
        </label>

        {/* input + ícone */}
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500  flex items-center justify-center">
            {icon}
          </span>

          <input
            ref={ref}
            id={id}
            className={cn(
              `
              w-full rounded-lg border bg-white px-3 py-2 pl-10 text-sm text-zinc-900 shadow-sm outline-none
              dark:bg-zinc-900 dark:text-zinc-100
              `,
              error
                ? // estado de erro: borda vermelha, sem ring
                  "border-zinc-300"
                : // estado normal: borda neutra + ring bonito só quando FOCADO
                  "border-zinc-300",
              className
            )}
            {...props}
          />
        </div>

        {/* mensagem de erro */}
        {error && (
          <span className="text-xs text-red-500 dark:text-red-400">
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
