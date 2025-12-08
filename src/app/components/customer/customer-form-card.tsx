"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  useForm,
  FormProvider,
  Controller,
  type FieldPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  customerFormSchema,
  type CustomerFormValues,
} from "@/schemas/customer-form-schema";
import {
  createCustomer,
  CreateCustomerPayload,
} from "@/services/customer.service";

import { Field } from "@/components/form/field";
import { Form } from "@/components/form/form";
import { Button } from "@/components/button/button";
import { SuccessModal } from "@/components/feedback/success-modal";
import { icons } from "@/components/icons";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Loading } from "@/components/loading/loading";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getProducts, type Product } from "@/services/products.service";

export function CustomerFormCard() {
  const [successCompany, setSuccessCompany] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

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
      products: [""], // índice 0 = produto principal
    },
    mode: "onSubmit",
    shouldFocusError: false,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    getValues,
    setValue,
    control,
    watch,
  } = methods;

  const HomeIcon = icons.home;

  const productsFieldValues = watch("products") ?? [];

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

  function handleCloseModal() {
    setIsSuccessOpen(false);
  }

  function addProduct() {
    const current = getValues("products") ?? [];
    setValue("products", [...current, ""]);
  }

  function removeLastProduct() {
    const current = getValues("products") ?? [];
    // mantém pelo menos o produto principal
    if (current.length <= 1) return;
    setValue("products", current.slice(0, -1));
  }

  function getAvailableProducts(index: number, currentValue?: string) {
    const allProducts = getValues("products") ?? [];
    const selectedCodes = new Set<string>();

    allProducts.forEach((code, idx) => {
      if (idx !== index && typeof code === "string" && code.trim().length > 0) {
        selectedCodes.add(code.trim());
      }
    });

    return products.filter((product) => {
      if (currentValue && product.code === currentValue) {
        return true;
      }
      return !selectedCodes.has(product.code);
    });
  }

  async function onSubmit(data: CustomerFormValues) {
    try {
      const productsList = (data.products ?? [])
        .map((s) => (s ?? "").trim())
        .filter(Boolean);

      const payload: CreateCustomerPayload = {
        company: data.company,
        cnpj: data.cnpj,
        responsible: data.responsible,
        email: data.email,
        phone: data.phone,
        sku: data.sku,
        supplier: data.supplier,
        products: productsList,
      };

      await createCustomer(payload);

      setSuccessCompany(data.company);
      setIsSuccessOpen(true);

      reset({
        company: "",
        cnpj: "",
        responsible: "",
        email: "",
        phone: "",
        sku: "",
        supplier: "",
        products: [""],
      });
    } catch (err) {
      console.error("❌ Falha no cadastro:", err);
    }
  }

  return (
    <AuthGuard fallbackMessage="Faça login para cadastrar um novo cliente.">
      <div className="w-full pb-5 md:px-0 md:py-6">
        <div className="relative mx-auto w-full max-w-4xl rounded-xl p-6 shadow-lg">
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

              {/* Produtos (products[0] principal + extras) */}
              <div className="space-y-2">
                <div className="relative">
                  {/* Produto principal = products[0] */}
                  <Controller
                    name={"products.0" as FieldPath<CustomerFormValues>}
                    control={control}
                    render={({ field, fieldState }) => {
                      const currentValue =
                        typeof field.value === "string" &&
                        field.value.trim().length > 0
                          ? field.value
                          : undefined;
                      const selectValue = currentValue ?? "";
                      const availableProducts = getAvailableProducts(
                        0,
                        currentValue
                      );

                      return (
                        <div className="space-y-1">
                          <label className="text-sm font-medium">
                            Produtos
                          </label>

                          <Select
                            value={selectValue}
                            onValueChange={field.onChange}
                            disabled={loadingProducts || !!productsError}
                          >
                            <SelectTrigger className="w-full" icon="hash">
                              <SelectValue
                                placeholder={
                                  loadingProducts
                                    ? "Carregando produtos..."
                                    : "Insira um produto"
                                }
                              />
                            </SelectTrigger>

                            <SelectContent>
                              {availableProducts.map((product) => (
                                <SelectItem
                                  key={product.id}
                                  value={product.code}
                                >
                                  {product.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {fieldState.error && (
                            <p className="text-xs text-destructive">
                              {fieldState.error.message}
                            </p>
                          )}

                          {productsError && (
                            <p className="text-xs text-destructive">
                              {productsError}
                            </p>
                          )}
                        </div>
                      );
                    }}
                  />

                  <div className="absolute right-0 top-0 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addProduct}
                      title="Adicionar produto"
                      className="h-6 w-6 p-0"
                    >
                      +
                    </Button>

                    {productsFieldValues.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={removeLastProduct}
                        title="Remover último produto"
                        className="h-6 w-6 p-0"
                      >
                        -
                      </Button>
                    )}
                  </div>
                </div>

                {/* Produtos extras: products[1..] */}
                {productsFieldValues.slice(1).map((_, idx) => {
                  const fieldIndex = idx + 1; // 1, 2, 3...
                  const fieldName =
                    `products.${fieldIndex}` as FieldPath<CustomerFormValues>;

                  return (
                    <Controller
                      key={fieldIndex}
                      name={fieldName}
                      control={control}
                      render={({ field }) => {
                        const currentValue =
                          typeof field.value === "string" &&
                          field.value.trim().length > 0
                            ? field.value
                            : undefined;
                        const selectValue = currentValue ?? "";
                        const availableProducts = getAvailableProducts(
                          fieldIndex,
                          currentValue
                        );

                        return (
                          <div className="space-y-1">
                            <label className="text-sm font-medium">
                              {fieldIndex + 1}º Produto
                            </label>

                            <Select
                              value={selectValue}
                              onValueChange={field.onChange}
                              disabled={loadingProducts || !!productsError}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione um produto" />
                              </SelectTrigger>

                              <SelectContent>
                                {availableProducts.map((product) => (
                                  <SelectItem
                                    key={product.id}
                                    value={product.code}
                                  >
                                    {product.code}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      }}
                    />
                  );
                })}
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
                      reset({
                        company: "",
                        cnpj: "",
                        responsible: "",
                        email: "",
                        phone: "",
                        sku: "",
                        supplier: "",
                        products: [""],
                      });
                    }}
                  >
                    Limpar
                  </Button>

                  <Button
                    type="submit"
                    variant="default"
                    disabled={isSubmitting}
                  >
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
      </div>
    </AuthGuard>
  );
}
