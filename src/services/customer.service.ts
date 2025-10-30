import { type CustomerFormValues } from "@/schemas/customer-form-schema";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
  /\/+$/,
  ""
);
if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL não foi definido. Crie .env.local com NEXT_PUBLIC_API_URL=http://127.0.0.1:8000"
  );
}

/** Modelo retornado pelo backend */
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
  created_at: string; // ISO
};

/** Respostas típicas */
export type CreateCustomerResponse = {
  message: string;
  data: Customer;
};

export type DeleteCustomerResponse = {
  message: string;
  deleted?: Partial<Customer>;
};

export type UpdateCustomerDto = Partial<Omit<Customer, "id" | "created_at">>;

// POST /customers
export async function createCustomer(
  payload: CustomerFormValues
): Promise<CreateCustomerResponse> {
  const res = await fetch(`${API_BASE_URL}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`POST ${res.status} ${res.statusText} — ${txt}`);
  }
  return res.json();
}

// GET /customers
export async function getCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_BASE_URL}/customers`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GET ${res.status} ${res.statusText} — ${txt}`);
  }
  return res.json();
}

// GET /customers/:id
export async function getCustomerById(id: string): Promise<Customer> {
  const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GET ${res.status} ${res.statusText} — ${txt}`);
  }
  return res.json();
}

// PATCH /customers/:id
export async function updateCustomer(
  id: string,
  data: UpdateCustomerDto
): Promise<Customer> {
  const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`PATCH ${res.status} ${res.statusText} — ${txt}`);
  }
  return res.json();
}

// DELETE /customers/:id
export async function deleteCustomer(
  id: string
): Promise<DeleteCustomerResponse> {
  const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`DELETE ${res.status} ${res.statusText} — ${txt}`);
  }
  return res.json();
}
