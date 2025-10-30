import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "Informe o e-mail" })
    .trim()
    .email("E-mail inválido"),
  password: z.string(),
});

export type LoginValues = z.infer<typeof loginSchema>;
