import { CreateTatumConnectionResponse, GetTatumConnectionResponse } from "api-types/tatum";
import { publicKeyToBitcoinAddressP2PKH } from "bitcoin/controller/adapter/bitcoin-adapter";
import { fetchFromApi, fetchFromTatum, HttpMethod } from "lib/http";
import { getPublicKey } from "react-native-blockchain-crypto-mpc";
import { MPCEcdsaKeyShare } from "shared/types/mpc";
import {
  CreateAccount,
  VirtualAccount,
  VirtualAddress,
  VirtualBalance,
  VirtualTransaction,
} from "wallet/types/virtual-wallet";
import endpoints from "../../blockchain/endpoints";

export const connectVirtualAccount = async (keyShare: MPCEcdsaKeyShare): Promise<VirtualAccount> => {
  const onlyTatumConnectionUsedPublicKey = await getPublicKey(keyShare.keyShare);
  const tatumConnectionAddress = publicKeyToBitcoinAddressP2PKH(onlyTatumConnectionUsedPublicKey);

  const { tatumId } = await fetchFromApi<GetTatumConnectionResponse>(
    "/tatum/connection/get?accountAddress=" + tatumConnectionAddress
  );

  //account already have an virtual account
  if (tatumId) {
    const virtualAccount = await fetchFromTatum<VirtualAccount>(endpoints.virtualAccounts.getAccount(tatumId));
    return virtualAccount;
  }
  //create new virtual account and save it in db
  else {
    const createAccountData: CreateAccount = {
      currency: "BTC",
    };

    const virtualAccount = await fetchFromTatum<VirtualAccount>(endpoints.virtualAccounts.createAccount(), {
      method: HttpMethod.POST,
      body: createAccountData,
    });

    const { created } = await fetchFromApi<CreateTatumConnectionResponse>("/tatum/connection/create", {
      method: HttpMethod.POST,
      body: {
        accountAddress: tatumConnectionAddress,
        tatumId: virtualAccount.id,
      },
    });
    if (created) return virtualAccount;
    throw new Error("Could not connect accountAddress with Tatum");
  }
};

// Can be only assigned, if its not already assigned to another virtual account
export const assignNewDepositAddress = (virtualAccount: VirtualAccount, address: string): Promise<VirtualAddress> => {
  return fetchFromTatum<VirtualAddress>(endpoints.virtualAccounts.assignNewDepositAddress(virtualAccount.id, address), {
    method: HttpMethod.POST,
  });
};

// Gets balance based on virtual account
export const getBalance = (account: VirtualAccount): Promise<VirtualBalance> => {
  return fetchFromTatum<VirtualBalance>(endpoints.virtualAccounts.balance(account.id));
};

// Gets all transactions of virtual account
export const getTransactions = (account: VirtualAccount): Promise<VirtualTransaction[]> => {
  return fetchFromTatum<VirtualTransaction[]>(endpoints.virtualAccounts.transactions("pageSize=10"), {
    method: HttpMethod.POST,
    body: { id: account.id },
  });
};
