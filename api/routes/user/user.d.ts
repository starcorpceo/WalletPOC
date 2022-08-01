import { MpcKeyShare } from "./wallet";

export interface User {
  id: string;
  devicePublicKey: string;
  keyShares: MpcKeyShare[];
}

export interface CreateUserRequest {
  devicePublicKey: string;
}

export interface CreateUserResponse {
  nonce: string;
  userId: string;
}

export interface VerifyUserRequest {
  userId: string;
  message: string;
  signature: string;
  devicePublicKey: string;
}
