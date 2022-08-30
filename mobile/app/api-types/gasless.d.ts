import { BigNumber } from "ethers";

export interface TankBalanceResponse {
  balance: BigNumber;
}

export interface TankAddressResponse {
  address: string;
}

export interface GaslessPermitResponse {
  transaction: any;
}

export interface GaslessPermitRequest {
  contractAddress: string;
  owner: string;
  spender: string;
  value: number;
  deadline: number;
  v: number;
  r: string;
  s: string;
}
