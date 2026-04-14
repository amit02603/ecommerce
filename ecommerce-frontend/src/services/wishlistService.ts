import apiClient from "@/lib/axios";
import { Wishlist } from "@/types";

interface WishlistResponse {
  success: boolean;
  wishlist: Wishlist;
}

export async function getWishlist(): Promise<WishlistResponse> {
  const response = await apiClient.get<WishlistResponse>("/wishlist");
  return response.data;
}

export async function addToWishlist(
  productId: string
): Promise<WishlistResponse> {
  const response = await apiClient.post<WishlistResponse>("/wishlist", {
    productId,
  });
  return response.data;
}

export async function removeFromWishlist(
  productId: string
): Promise<WishlistResponse> {
  const response = await apiClient.delete<WishlistResponse>(
    `/wishlist/${productId}`
  );
  return response.data;
}
