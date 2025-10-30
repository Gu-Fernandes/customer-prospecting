"use client";

import { useEffect, useState } from "react";
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

function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const read = () => setToken(localStorage.getItem("access_token"));
    read();

    // Se o token mudar em outra aba/janela, atualiza aqui também
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return token;
}

export function CustomerFormCard() {
  const token = useAuthToken(); // <- se for null, usuário está "deslogado"
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
      // Opcional: checagem extra (além do guard de renderização)
      if (!token) {
        throw new Error("Você precisa estar logado para cadastrar clientes.");
      }

      const response = await createCustomer(data);
      console.log("✅ API respondeu:", response);

      setSuccessCompany(data.company);
      setIsSuccessOpen(true);
      reset();
    } catch (err) {
      console.error("❌ Falha no cadastro:", err);
      // Futuro: modal/toast de erro
    }
  }

  // === Guard de autenticação: se não há token, mostra aviso em vez do form ===
  if (!token) {
    return (
      <div className="w-full max-w-xl rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Login necessário
        </h1>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Para cadastrar um cliente é necessário estar logado.
        </p>

        <div className="flex items-center justify-end gap-2">
          <Link href="/">
            <Button variant="outline" icon="home">
              Início
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="default">Ir para login</Button>
          </Link>
        </div>
      </div>
    );
  }

  // === Formulário (usuário logado) ===
  return (
    <>
      <SuccessModal
        isOpen={isSuccessOpen}
        companyName={successCompany}
        onClose={handleCloseModal}
      />

      <div className="w-full max-w-4xl rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
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
              placeholder="Produto principal"
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
                <Button
                  variant="outline"
                  className="px-2"
                  icon="home"
                  iconPosition="only"
                  aria-label="Início"
                />
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
    </>
  );
}
