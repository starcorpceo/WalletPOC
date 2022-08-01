import { config } from "config/config";
import * as bitcoin from "der-bitcoinjs-lib";
import { fetchFromTatum, HttpMethod } from "lib/http";
import "shim";
import endpoints from "wallet/endpoints";
import {
  CreateAccount,
  VirtualAccount,
  VirtualAddress,
  VirtualBalance,
} from "wallet/virtual-wallet";
import { Balance } from "wallet/wallet";

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

// Can be only assigned, if its not already assigned to another virtual account
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

// Gets balance based on virtual account
export const getBalance = (
  account: VirtualAccount
): Promise<VirtualBalance> => {
  return fetchFromTatum<VirtualBalance>(
    endpoints.virtualAccounts.balance(account.id)
  );
};
