import endpoints from "bitcoin/blockchain/endpoints";
import { fetchFromTatum, HttpMethod } from "lib/http";
import "shim";
import {
  CreateAccount,
  VirtualAccount,
  VirtualAddress,
  VirtualBalance,
  VirtualTransaction,
} from "wallet/types/virtual-wallet";

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

// Gets all transactions of virtual account
export const getTransactions = (
  account: VirtualAccount
): Promise<VirtualTransaction[]> => {
  return fetchFromTatum<VirtualTransaction[]>(
    endpoints.virtualAccounts.transactions("pageSize=10"),
    { method: HttpMethod.POST, body: { id: account.id } }
  );
};
