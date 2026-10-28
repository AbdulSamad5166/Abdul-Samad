export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface LoginPayload {
  username: string;
  password: string;
  expiresInMins: number;
}

export interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse extends Omit<User, "image"> {
  id: number;
}
