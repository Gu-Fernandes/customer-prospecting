"use client";

import { FormEventHandler, ReactNode } from "react";

type FormProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  className?: string;
  noValidate?: boolean;
};

export function Form({
  onSubmit,
  children,
  className = "",
  noValidate = true,
}: FormProps) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate={noValidate}
      className={`flex flex-col gap-4 ${className}`}
    >
      {children}
    </form>
  );
}
