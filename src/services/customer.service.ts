import { CustomerFormValues } from "@/schemas/customer-form-schema";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL não foi definido. Crie .env.local com NEXT_PUBLIC_API_URL=http://127.0.0.1:8000"
  );
}

// Esse tipo representa exatamente o que o backend retorna em GET /customers
export type Customer = {
  id: string;
  company: string;
  cnpj: string;
  responsible: string;
  email: string;
  phone: string;
  main_product: string;
  sku: string;
  supplier: string;
  created_at: string; // ISO string
};

// Resposta do POST /customers
export type CreateCustomerResponse = {
  message: string;
  data: Customer;
};

// POST - usado no cadastro
export async function createCustomer(
  payload: CustomerFormValues
): Promise<CreateCustomerResponse> {
  const res = await fetch(`${API_BASE_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Erro desconhecido");
    throw new Error(`Erro ao cadastrar cliente [${res.status}]: ${errorText}`);
  }

  return res.json();
}

// GET - lista todos os clientes (para prospection)
export async function getCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_BASE_URL}/customers`, {
    method: "GET",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Erro desconhecido");
    throw new Error(`Erro ao buscar clientes [${res.status}]: ${errorText}`);
  }

  return res.json();
}
