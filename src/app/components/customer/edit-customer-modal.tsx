"use client";

import { useEffect, useState } from "react";
import {
  FormProvider,
  useForm,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
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
  type UpdateCustomerDto,
} from "@/services/customer.service";
import {
  customerFormSchema,
  type CustomerFormValues,
} from "@/schemas/customer-form-schema";
import { ConfirmDeleteModal } from "@/components/feedback/confirm-delete-modal";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getProducts, type Product } from "@/services/products.service";

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
      sku: "",
      supplier: "",
      products: [],
    },
    mode: "onSubmit",
    shouldFocusError: false,
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [productValues, setProductValues] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoadingProducts(true);
        setProductsError(null);
        const data = await getProducts();
        if (!active) return;
        setProducts(data);
      } catch (err) {
        console.error("❌ Erro ao carregar produtos:", err);
        if (!active) return;
        setProductsError("Não foi possível carregar a lista de produtos.");
      } finally {
        if (!active) return;
        setLoadingProducts(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !customer) return;

    const productsFromCustomer = Array.isArray(customer.products)
      ? customer.products
      : [];

    reset({
      company: customer.company ?? "",
      cnpj: customer.cnpj ?? "",
      responsible: customer.responsible ?? "",
      email: customer.email ?? "",
      phone: customer.phone ?? "",
      sku: customer.sku ?? "",
      supplier: customer.supplier ?? "",
      products: productsFromCustomer,
    });

    setProductValues(productsFromCustomer);
  }, [isOpen, customer, reset]);

  if (!isOpen || !customer) return null;

  function getAvailableProducts(index: number, currentValue?: string) {
    const selected = new Set(
      productValues
        .map((value, idx) => (idx === index ? null : value))
        .filter(
          (v): v is string => typeof v === "string" && v.trim().length > 0
        )
    );

    return products.filter((p) => {
      if (currentValue && p.code === currentValue) return true;
      return !selected.has(p.code);
    });
  }

  function handleChangeProduct(index: number, newCode: string) {
    setProductValues((prev) => {
      const clone = [...prev];
      clone[index] = newCode;
      return clone;
    });
  }

  function handleAddProduct() {
    setProductValues((prev) => [...prev, ""]);
  }

  function handleRemoveProduct(index: number) {
    setProductValues((prev) => prev.filter((_, i) => i !== index));
  }

  const onSubmit: SubmitHandler<CustomerFormValues> = async (values) => {
    if (!customer) return;

    const productList = productValues
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const payload: UpdateCustomerDto = {
      company: values.company,
      cnpj: values.cnpj,
      responsible: values.responsible,
      email: values.email,
      phone: values.phone,
      sku: values.sku,
      supplier: values.supplier,
      products: productList,
    };

    const updated = await updateCustomer(customer.id, payload);
    onUpdated?.(updated);
    onClose();
  };

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
                name="sku"
                label="SKU Principal"
                placeholder="SKU"
                icon="hash"
                format="upper"
              />

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Produtos</label>

                {productValues.length === 0 && (
                  <p className="text-xs text-zinc-500">
                    Nenhum produto adicionado. Clique em &quot;+&quot; para
                    adicionar.
                  </p>
                )}

                {productValues.map((value, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Controller
                      name="products"
                      control={control}
                      render={() => {
                        const available = getAvailableProducts(index, value);
                        return (
                          <Select
                            value={value}
                            onValueChange={(val) =>
                              handleChangeProduct(index, val)
                            }
                            disabled={loadingProducts || !!productsError}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  loadingProducts
                                    ? "Carregando produtos..."
                                    : `Produto ${index + 1}`
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {available.map((p) => (
                                <SelectItem key={p.id} value={p.code}>
                                  {p.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveProduct(index)}
                      className="h-8 w-8 p-0 flex items-center justify-center"
                      title="Remover produto"
                    >
                      -
                    </Button>
                  </div>
                ))}

                <div className="pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddProduct}
                    className="h-8 px-3"
                  >
                    +
                  </Button>
                </div>

                {productsError && (
                  <p className="text-xs text-destructive">{productsError}</p>
                )}
              </div>

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

                <div className="flex items-center gap-2 ml-auto">
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
