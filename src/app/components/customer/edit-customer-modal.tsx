"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/button/button";
import { Form } from "@/components/form/form";
import { Field } from "@/components/form/field";
import { cn } from "@/libs/cn";
import { icons } from "@/components/icons";
import {
  Customer,
  updateCustomer,
  deleteCustomer,
} from "@/services/customer.service";
import {
  customerFormSchema,
  type CustomerFormValues,
} from "@/schemas/customer-form-schema";
import { ConfirmDeleteModal } from "@/components/feedback/confirm-delete-modal";

type Props = {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onUpdated?: (updated: Customer) => void;
  onDeleted?: (id: string) => void;
};

export function EditCustomerModal({
  isOpen,
  customer,
  onClose,
  onUpdated,
  onDeleted,
}: Props) {
  const XIcon = icons.x;

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

  useEffect(() => {
    if (customer) {
      reset({
        company: customer.company ?? "",
        cnpj: customer.cnpj ?? "",
        responsible: customer.responsible ?? "",
        email: customer.email ?? "",
        phone: customer.phone ?? "",
        main_product: customer.main_product ?? "",
        sku: customer.sku ?? "",
        supplier: customer.supplier ?? "",
      });
    }
  }, [customer, reset]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !customer) return null;

  async function onSubmit(values: CustomerFormValues) {
    if (!customer) return;
    const updated = await updateCustomer(customer.id, values);
    onUpdated?.(updated);
    onClose();
  }

  async function confirmDelete() {
    try {
      setIsDeleting(true);
      if (!customer) return;
      await deleteCustomer(customer.id);
      onDeleted?.(customer.id);
      setConfirmOpen(false);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {/* Backdrop + painel responsivo */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4",
          "bg-black/40 backdrop-blur-[2px]"
        )}
      >
        <div
          className={cn(
            "relative w-full sm:max-w-2xl rounded-xl border border-zinc-200",
            "bg-white p-4 sm:p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900",
            "max-h-[90vh] overflow-y-auto"
          )}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="Fechar"
          >
            <XIcon className="h-4 w-4" />
          </button>

          <h2 className="mb-4 text-lg font-semibold">Editar cliente</h2>

          <FormProvider {...methods}>
            <Form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
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

              <div className="md:col-span-2 mt-2 flex w-full items-center justify-between gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="destructive"
                  icon="trash"
                  aria-label="Excluir cliente"
                  onClick={() => setConfirmOpen(true)}
                  className="px-2 sm:px-4"
                >
                  <span className="hidden sm:inline">Excluir cliente</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </div>
            </Form>
          </FormProvider>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir esse cliente?"
        loading={isDeleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
