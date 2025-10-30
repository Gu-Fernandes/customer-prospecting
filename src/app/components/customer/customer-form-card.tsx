// src/app/customers/customer-form-card.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
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

export function CustomerFormCard() {
  const [successCompany, setSuccessCompany] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

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
  } = methods;

  function handleCloseModal() {
    setIsSuccessOpen(false);
  }

  async function onSubmit(data: CustomerFormValues) {
    try {
      await createCustomer(data);
      setSuccessCompany(data.company);
      setIsSuccessOpen(true);
      reset();
    } catch (err) {
      console.error("❌ Falha no cadastro:", err);
    }
  }

  const HomeIcon = icons.home;

  return (
    <AuthGuard fallbackMessage="Faça login para cadastrar um novo cliente.">
      <SuccessModal
        isOpen={isSuccessOpen}
        companyName={successCompany}
        onClose={handleCloseModal}
      />

      <div className="w-full max-w-4xl rounded-xl p-6 shadow-lg">
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
              name="main_product"
              label="Produto Principal"
              placeholder="Produto"
              icon="hash"
              format="upper"
            />
            <Field
              name="sku"
              label="SKU Produto Principal"
              placeholder="SKU"
              icon="hash"
              format="upper"
            />
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
                <Button type="button" variant="outline" onClick={() => reset()}>
                  Limpar
                </Button>
                <Button type="submit" variant="default" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </div>
          </Form>
        </FormProvider>
      </div>
    </AuthGuard>
  );
}
