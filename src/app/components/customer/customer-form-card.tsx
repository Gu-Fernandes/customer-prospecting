"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  customerFormSchema,
  type CustomerFormValues,
} from "@/schemas/customer-form-schema";
import { createCustomer } from "@/services/customer.service";
import { Field } from "@/components/form/field";
import { Button } from "@/components/button/button";
import { Form } from "@/components/form/form";
import { SuccessModal } from "@/components/feedback/success-modal";
import { icons } from "@/components/icons";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Loading } from "@/components/loading/loading";

export function CustomerFormCard() {
  const [successCompany, setSuccessCompany] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [extraKeys, setExtraKeys] = useState<string[]>([]);
  const [extraSeq, setExtraSeq] = useState(0);

  const methods = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      company: "",
      cnpj: "",
      responsible: "",
      email: "",
      phone: "",
      main_product: "",
      sku: "",
      supplier: "",
    },
    mode: "onSubmit",
    shouldFocusError: false,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    getValues,
    unregister,
    control,
  } = methods;

  function handleCloseModal() {
    setIsSuccessOpen(false);
  }

  function addProduct() {
    const name = `extra_product_${extraSeq}`;
    setExtraKeys((prev) => [...prev, name]);
    setExtraSeq((n) => n + 1);
  }

  function removeLastProduct() {
    if (extraKeys.length === 0) return;
    const lastKey = extraKeys[extraKeys.length - 1];
    const raw = (getValues() as Record<string, unknown>)[lastKey];
    const hasContent = typeof raw === "string" && raw.trim().length > 0;
    if (hasContent) return;
    unregister(lastKey as any);
    setExtraKeys((prev) => prev.slice(0, -1));
  }

  async function onSubmit(data: CustomerFormValues) {
    try {
      const all = getValues();

      const extras = extraKeys
        .map((k) => (all as Record<string, unknown>)[k])
        .map((v) => (typeof v === "string" ? v.trim() : ""))
        .filter(Boolean);

      const mergedMainProduct = [data.main_product, ...extras]
        .map((s) => (s ?? "").trim())
        .filter(Boolean)
        .join(", ");

      const payload: CustomerFormValues = {
        ...data,
        main_product: mergedMainProduct,
      };

      await createCustomer(payload);
      setSuccessCompany(data.company);
      setIsSuccessOpen(true);

      reset();
      setExtraKeys([]);
    } catch (err) {
      console.error("❌ Falha no cadastro:", err);
    }
  }

  const HomeIcon = icons.home;

  const lastKey = extraKeys.length > 0 ? extraKeys[extraKeys.length - 1] : null;
  const lastVal =
    (useWatch({ control, name: (lastKey as any) ?? "" }) as
      | string
      | undefined) ?? "";
  const lastFilled = lastVal.trim().length > 0;

  return (
    <AuthGuard fallbackMessage="Faça login para cadastrar um novo cliente.">
      <div className="relative w-full max-w-4xl rounded-xl p-6 shadow-lg">
        <SuccessModal
          isOpen={isSuccessOpen}
          companyName={successCompany}
          onClose={handleCloseModal}
        />

        <div className="mb-6">
          <h1 className="text-xl font-semibold">Dados do Cliente</h1>
        </div>

        <FormProvider {...methods}>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <Field
              name="company"
              label="Empresa"
              placeholder="Razão social"
              icon="building"
            />

            <Field
              name="cnpj"
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              format="cnpj"
              icon="fileDigit"
            />

            <Field
              name="responsible"
              label="Responsável"
              placeholder="Nome do responsável"
              icon="user"
            />

            <Field
              name="email"
              type="email"
              label="E-mail"
              placeholder="E-mail do responsável"
              icon="email"
            />

            <Field
              name="phone"
              label="Telefone"
              placeholder="(11) 99999-9999"
              format="phone"
              icon="phone"
            />

            <Field
              name="sku"
              label="SKU Produto Principal"
              placeholder="SKU"
              icon="hash"
              format="upper"
            />

            <div className="space-y-2">
              <div className="relative">
                <Field
                  name="main_product"
                  label="Produtos"
                  placeholder="Produto"
                  icon="hash"
                  format="upper"
                />

                <div className="absolute right-0 top-0 flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addProduct}
                    aria-label="Adicionar produto"
                    title="Adicionar produto"
                    className="h-6 w-6 p-0"
                  >
                    +
                  </Button>

                  {extraKeys.length > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={removeLastProduct}
                      disabled={lastFilled}
                      aria-label={
                        lastFilled
                          ? "Limpe o último campo para remover"
                          : "Remover último produto"
                      }
                      title={
                        lastFilled
                          ? "Limpe o último campo para remover"
                          : "Remover último produto"
                      }
                      className="h-6 w-6 p-0"
                    >
                      -
                    </Button>
                  )}
                </div>
              </div>

              {extraKeys.map((name, idx) => (
                <Field
                  key={name}
                  name={name}
                  label=""
                  placeholder={`${idx + 2}º Produto`}
                  icon="hash"
                  format="upper"
                />
              ))}
            </div>

            <Field
              name="supplier"
              label="Fornecedor"
              placeholder="Fornecedor do item"
              icon="container"
            />

            <div className="md:col-span-2 flex items-center justify-between gap-2 pt-2">
              <Link href="/">
                <Button variant="outline" className="px-2">
                  <HomeIcon className="h-4 w-4" />
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setExtraKeys([]);
                  }}
                >
                  Limpar
                </Button>
                <Button type="submit" variant="default" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar"}
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
