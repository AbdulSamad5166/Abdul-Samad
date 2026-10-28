import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, User } from "../types/auth";
import client from "./client";

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await client.post<RegisterResponse>("/users/add", payload);
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await client.get<User>("/auth/me");
  return response.data;
}
