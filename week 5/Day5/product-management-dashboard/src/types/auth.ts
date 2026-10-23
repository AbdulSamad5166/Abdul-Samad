/**
 * Authentication types and interfaces
 */

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  token?: string;
  accessToken?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthSession {
  token: string;
  username: string;
  name: string;
  email?: string;
  avatar?: string;
}
