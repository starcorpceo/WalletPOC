export interface User {
  id: string;
  secret: string;
}

export interface CreateUserRequest {
  secret: string;
}
