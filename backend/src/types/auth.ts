export interface User {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface SignupInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
}
