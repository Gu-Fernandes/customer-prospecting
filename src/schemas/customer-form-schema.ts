import { z } from "zod";

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export const customerFormSchema = z.object({
  company: z
    .string()
    .min(1, "Informe o nome da empresa")
    .max(80, "Máximo de 80 caracteres"),

  cnpj: z
    .string()
    .min(1, "Informe o CNPJ")
    .transform(onlyDigits)
    .refine((v) => v.length === 14, {
      message: "CNPJ inválido (precisa ter 14 dígitos)",
    }),

  responsible: z
    .string()
    .min(2, "Informe o responsável")
    .max(80, "Máximo de 80 caracteres"),

  email: z
    .string()
    .min(1, "Digite o e-mail da empresa ou responsável")
    .email("E-mail inválido"),

  phone: z
    .string()
    .min(1, "Informe o telefone da empresa ou responsável")
    .transform(onlyDigits)
    .refine((v) => v.length >= 10 && v.length <= 11, {
      message: "Telefone inválido",
    }),

  main_product: z
    .string()
    .min(1, "Produto principal é obrigatório")
    .max(120, "Máximo de 120 caracteres"),

  sku: z
    .string()
    .min(1, "SKU é obrigatório")
    .max(60, "Máximo de 60 caracteres"),
  supplier: z
    .string()
    .min(2, "Informe o fornecedor")
    .max(60, "Máximo de 60 caracteres"),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
