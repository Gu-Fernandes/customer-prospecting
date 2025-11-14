import { api } from "./api.service";

export type Product = {
  id: string;
  code: string;
  created_at: string;
};

export type CreateProductDto = {
  code: string;
};

export type UpdateProductDto = Partial<Pick<Product, "code">>;

export type CreateProductResponse = {
  message: string;
  data: Product;
};

export async function createProduct(
  payload: CreateProductDto
): Promise<CreateProductResponse> {
  return api.post<CreateProductResponse>("/products", payload);
}

export async function getProducts(): Promise<Product[]> {
  return api.get<Product[]>("/products");
}

export async function getProduct(id: string): Promise<Product> {
  return api.get<Product>(`/products/${id}`);
}

export async function updateProduct(
  id: string,
  data: UpdateProductDto
): Promise<Product> {
  return api.patch<Product>(`/products/${id}`, data);
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/products/${id}`);
}
