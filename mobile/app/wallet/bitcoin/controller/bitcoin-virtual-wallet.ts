import { config } from "config/config";
import * as bitcoin from "der-bitcoinjs-lib";
import { fetchFromTatum, HttpMethod } from "lib/http";
import { signEcdsa } from "lib/mpc";
import "shim";
import endpoints from "wallet/endpoints";
import { CreateAccount, VirtualAccount } from "wallet/virtual-wallet";
import {
  Balance,
  CryptoWallet,
  Fees,
  Input,
  Output,
  Transaction,
  UTXO,
} from "wallet/wallet";
import { BitcoinWallet } from "..";
import { User } from "../../../api-types/user";

export const createNewVirtualAccount = (
  xpub: string
): Promise<VirtualAccount> => {
  const createAccountData: CreateAccount = {
    currency: "BTC",
    xpub: xpub,
  };

  return fetchFromTatum<VirtualAccount>(
    endpoints.virtualAccounts.createAccount(),
    {
      method: HttpMethod.POST,
      body: { createAccountData },
    }
  );
};
