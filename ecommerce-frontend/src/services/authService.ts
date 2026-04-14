import apiClient from "@/lib/axios";
import { User } from "@/types";

// The shape of data we send when registering
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// The shape of data we send when logging in
interface LoginData {
  email: string;
  password: string;
}

// The shape of the response we get back from auth endpoints
interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/register", data);
  return response.data;
}

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);
  return response.data;
}

export async function logoutUser(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function getCurrentUser(): Promise<{ success: boolean; user: User }> {
  const response = await apiClient.get<{ success: boolean; user: User }>("/auth/me");
  return response.data;
}
