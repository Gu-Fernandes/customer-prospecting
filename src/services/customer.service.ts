import type { CustomerFormValues } from "@/schemas/customer-form-schema";
import { api } from "./api.service";

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
  created_at: string;
};

export type CreateCustomerResponse = {
  message: string;
  data: Customer;
};

export type UpdateCustomerDto = Partial<Omit<Customer, "id" | "created_at">>;

export async function createCustomer(
  payload: CustomerFormValues
): Promise<CreateCustomerResponse> {
  return api.post<CreateCustomerResponse>("/customers", payload);
}

export async function getCustomers(): Promise<Customer[]> {
  return api.get<Customer[]>("/customers");
}

export async function updateCustomer(
  id: string,
  data: UpdateCustomerDto
): Promise<Customer> {
  return api.patch<Customer>(`/customers/${id}`, data);
}

export async function deleteCustomer(id: string): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/customers/${id}`);
}
