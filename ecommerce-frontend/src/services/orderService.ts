import apiClient from "@/lib/axios";
import { Order, Address } from "@/types";

interface PlaceOrderData {
  items: { product: string; quantity: number }[];
  shippingAddress: Omit<Address, "_id" | "isDefault">;
  paymentInfo: { id: string; status: string };
}

interface OrderListResponse {
  success: boolean;
  count: number;
  orders: Order[];
}

export async function placeOrder(
  data: PlaceOrderData
): Promise<{ success: boolean; order: Order }> {
  const response = await apiClient.post<{ success: boolean; order: Order }>(
    "/orders",
    data
  );
  return response.data;
}

export async function getMyOrders(): Promise<OrderListResponse> {
  const response = await apiClient.get<OrderListResponse>("/orders/mine");
  return response.data;
}

export async function getOrderById(
  id: string
): Promise<{ success: boolean; order: Order }> {
  const response = await apiClient.get<{ success: boolean; order: Order }>(
    `/orders/${id}`
  );
  return response.data;
}

export async function getAllOrders(): Promise<
  OrderListResponse & { totalRevenue: number }
> {
  const response = await apiClient.get<
    OrderListResponse & { totalRevenue: number }
  >("/orders");
  return response.data;
}

export async function updateOrderStatus(
  id: string,
  status: Order["orderStatus"]
): Promise<{ success: boolean; order: Order }> {
  const response = await apiClient.put<{ success: boolean; order: Order }>(
    `/orders/${id}/status`,
    { status }
  );
  return response.data;
}
