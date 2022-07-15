import { MPCWallet } from "./wallet";

export interface User {
  id: string;
  devicePublicKey: string;
  wallets: MPCWallet[];
  bip44MasterWallet: MPCWallet | undefined;
  bip44PurposeWallet: MPCWallet | undefined;
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
