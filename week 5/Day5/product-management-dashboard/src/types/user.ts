/**
 * User types and interfaces from DummyJSON /users endpoint
 */

export interface UserAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export interface UserCompany {
  department: string;
  name: string;
  title: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  email: string;
  phone?: string;
  username: string;
  image?: string;
  role?: string;
  company?: UserCompany;
  address?: UserAddress;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}
