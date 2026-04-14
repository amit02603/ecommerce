import apiClient from "@/lib/axios";
import { Product, ProductListResponse, ProductQueryParams } from "@/types";

export async function getProducts(
  params?: ProductQueryParams
): Promise<ProductListResponse> {
  const response = await apiClient.get<ProductListResponse>("/products", {
    params,
  });
  return response.data;
}

export async function getProductBySlug(
  slug: string
): Promise<{ success: boolean; product: Product }> {
  const response = await apiClient.get<{ success: boolean; product: Product }>(
    `/products/${slug}`
  );
  return response.data;
}

export async function createProduct(
  data: FormData
): Promise<{ success: boolean; product: Product }> {
  const response = await apiClient.post<{ success: boolean; product: Product }>(
    "/products",
    data,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<{ success: boolean; product: Product }> {
  const response = await apiClient.put<{ success: boolean; product: Product }>(
    `/products/${id}`,
    data
  );
  return response.data;
}

export async function deleteProduct(
  id: string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete<{ success: boolean; message: string }>(
    `/products/${id}`
  );
  return response.data;
}
