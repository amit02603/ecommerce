import apiClient from "@/lib/axios";
import { Cart } from "@/types";

interface CartResponse {
  success: boolean;
  cart: Cart;
}

export async function getCart(): Promise<CartResponse> {
  const response = await apiClient.get<CartResponse>("/cart");
  return response.data;
}

export async function addToCart(
  productId: string,
  quantity: number
): Promise<CartResponse> {
  const response = await apiClient.post<CartResponse>("/cart", {
    productId,
    quantity,
  });
  return response.data;
}

export async function updateCartItem(
  itemId: string,
  quantity: number
): Promise<CartResponse> {
  const response = await apiClient.put<CartResponse>(`/cart/${itemId}`, {
    quantity,
  });
  return response.data;
}

export async function removeFromCart(itemId: string): Promise<CartResponse> {
  const response = await apiClient.delete<CartResponse>(`/cart/${itemId}`);
  return response.data;
}

export async function clearCart(): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete<{ success: boolean; message: string }>(
    "/cart/clear"
  );
  return response.data;
}
