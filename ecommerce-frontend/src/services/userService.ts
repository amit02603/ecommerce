import apiClient from "@/lib/axios";
import { Address } from "@/types";

export async function addAddress(addressData: Partial<Address>): Promise<{ success: boolean; addresses: Address[] }> {
  const response = await apiClient.post("/users/address", addressData);
  return response.data;
}

export async function deleteAddress(addressId: string): Promise<{ success: boolean; addresses: Address[] }> {
  const response = await apiClient.delete(`/users/address/${addressId}`);
  return response.data;
}
