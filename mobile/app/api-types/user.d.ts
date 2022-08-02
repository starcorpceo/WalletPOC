export interface User {
  id: string;
  devicePublicKey: string;
  keyShares: MPCEcdsaKeyShare[];
  bip44MasterKeyShare: MasterKeyShare;
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
  deviceSignature: string;
  devicePublicKey: string;
}
