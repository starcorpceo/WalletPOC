import { config } from "config/config";
import * as bitcoin from "der-bitcoinjs-lib";
import { fetchFromTatum, HttpMethod } from "lib/http";
import "shim";
import endpoints from "wallet/endpoints";
import {
  CreateAccount,
  VirtualAccount,
  VirtualAddress,
} from "wallet/virtual-wallet";

export const createNewVirtualAccount = (): Promise<VirtualAccount> => {
  const createAccountData: CreateAccount = {
    currency: "BTC",
  };

  return fetchFromTatum<VirtualAccount>(
    endpoints.virtualAccounts.createAccount(),
    {
      method: HttpMethod.POST,
      body: createAccountData,
    }
  );
};

export const assignNewDepositAddress = (
  virtualAccount: VirtualAccount,
  address: string
): Promise<VirtualAddress> => {
  return fetchFromTatum<VirtualAddress>(
    endpoints.virtualAccounts.assignNewDepositAddress(
      virtualAccount.id,
      address
    ),
    { method: HttpMethod.POST }
  );
};
