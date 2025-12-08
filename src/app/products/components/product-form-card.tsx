"use client";

import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/button/button";
import { Field } from "@/components/form/field";
import { Form } from "@/components/form/form";
import { Loading } from "@/components/loading/loading";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/schemas/product-form-schema";
import { createProduct } from "@/services/products.service";

type Props = {
  onSuccess?: (code: string) => void;
};

export function ProductFormCard({ onSuccess }: Props) {
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { code: "" },
    mode: "onSubmit",
    shouldFocusError: false,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  async function onSubmit(data: ProductFormValues) {
    try {
      await createProduct({ code: data.code });
      onSuccess?.(data.code);
    } catch (error) {
      const description =
        error instanceof Error && error.message
          ? error.message
          : "Não foi possível cadastrar o produto. Tente novamente.";

      toast.error("Erro ao cadastrar produto", { description });
    }
  }

  return (
    <div className="relative w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-lg">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Novo Produto</h1>
        <p className="text-sm text-zinc-600 dark:text-foreground/70">
          Informe o código do produto.
        </p>
      </div>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <Field
            name="code"
            label="Código"
            placeholder="Ex.: PRODUTO-001"
            icon="hash"
            format="upper"
          />

          <div className="mt-2 flex items-center justify-between gap-2">
            <Link href="/products">
              <Button variant="destructive">Cancelar</Button>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset({ code: "" })}
              >
                Limpar
              </Button>
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </Form>
      </FormProvider>

      {isSubmitting && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl">
          <Loading label="Enviando..." />
        </div>
      )}
    </div>
  );
}
