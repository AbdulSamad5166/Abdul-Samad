import { apiClient } from './client';
import { LoginCredentials, LoginResponse, RegisterData } from '../types/auth';
import { User } from '../types/user';

/**
 * Login user using DummyJSON /auth/login
 * Test credentials: username "emilys", password "emilyspass"
 */
export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', {
    username: credentials.username,
    password: credentials.password,
    expiresInMins: 60,
  });
  return response.data;
}

/**
 * Register user using DummyJSON /users/add
 * Simulates user creation
 */
export async function registerUser(data: RegisterData): Promise<User> {
  const response = await apiClient.post<User>('/users/add', {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    username: data.username,
    password: data.password,
  });
  return response.data;
}
