import { Wallet } from "./wallet";

export interface User {
  id: string;
  devicePublicKey: string;
  wallets: Wallet[];
  bip44MasterWallet: Wallet | undefined;
  bip44PurposeWallet: Wallet | undefined;
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
