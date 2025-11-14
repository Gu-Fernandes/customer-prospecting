"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/button/button";
import { Field } from "@/components/form/field";
import { Form } from "@/components/form/form";
import { Loading } from "@/components/loading/loading";
import {
  productFormSchema,
  ProductFormValues,
} from "@/schemas/product-form-schema";
import { createProduct } from "@/services/products.service";

export function ProductFormCard() {
  const router = useRouter();

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
    await createProduct({ code: data.code });
    // volta para a lista
    router.replace("/products");
  }

  return (
    <AuthGuard fallbackMessage="Faça login para cadastrar produtos.">
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
                <Button variant="outline">Cancelar</Button>
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
    </AuthGuard>
  );
}
