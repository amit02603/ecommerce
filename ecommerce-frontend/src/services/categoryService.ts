import apiClient from "@/lib/axios";
import { Category } from "@/types";

interface CategoryListResponse {
  success: boolean;
  count: number;
  categories: Category[];
}

export async function getCategories(): Promise<CategoryListResponse> {
  const response = await apiClient.get<CategoryListResponse>("/categories");
  return response.data;
}

export async function createCategory(
  data: Partial<Category>
): Promise<{ success: boolean; category: Category }> {
  const response = await apiClient.post<{ success: boolean; category: Category }>(
    "/categories",
    data
  );
  return response.data;
}

export async function deleteCategory(
  id: string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete<{ success: boolean; message: string }>(
    `/categories/${id}`
  );
  return response.data;
}
