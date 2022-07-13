import { Wallet } from "./wallet";

export interface User {
  id: string;
  devicePublicKey: string;
  wallets: Wallet[];
  masterWallet: Wallet | undefined;
  bip44Wallet: Wallet | undefined;
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
