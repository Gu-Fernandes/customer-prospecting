import { z } from "zod";

export const productFormSchema = z.object({
  code: z
    .string({ message: "Código é obrigatório." })
    .trim()
    .min(1, "Informe o código do produto."),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
