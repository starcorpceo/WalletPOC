import { BigNumber } from "ethers";

export interface TankBalanceResponse {
  balance: BigNumber;
}

export interface TankAddressResponse {
  address: string;
}

export interface GaslessTransactionResponse {
  transaction: any;
}

export interface GaslessPermitRequest {
  contractAddress: string;
  owner: string;
  spender: string;
  value: string;
  deadline: number;
  v: number;
  r: string;
  s: string;
}

export interface GaslessTransferRequest {
  contractAddress: string;
  from: string;
  to: string;
  value: string;
}
