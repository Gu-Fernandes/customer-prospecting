"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/button/button";
import { Form } from "@/components/form/form";
import { Field } from "@/components/form/field";
import { login } from "@/services/auth.service";

import { loginSchema, type LoginValues } from "@/schemas/login.schema";

type Props = { onSuccess?: () => void };

export function LoginCard({ onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
    shouldFocusError: false,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: LoginValues) {
    setError(null);
    try {
      await login(values);
      onSuccess?.();
    } catch (err) {
      setError("E-mail ou senha inválidos.");
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <h1 className="mb-4 text-xl font-semibold">Entrar</h1>

      {error && (
        <div className="mb-3 rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <FormProvider {...methods}>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4"
        >
          <Field
            name="email"
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            icon="email"
          />
          <Field
            name="password"
            label="Senha"
            type="password"
            placeholder="sua senha"
            icon="lock"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </Form>
      </FormProvider>
    </div>
  );
}
