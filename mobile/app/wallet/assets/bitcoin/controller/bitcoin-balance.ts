import { Balance, CoinTypeAccount } from "wallet/types/wallet";
import { BitcoinService } from "../../../../../packages/blockchain-api-client/src";
import { BitcoinProvider } from "../../../../../packages/blockchain-api-client/src/blockchains/bitcoin/bitcoin-factory";
import { BitcoinToSatoshis } from "./bitcoin-utils";

export const getBalanceFromAccount = async (account: CoinTypeAccount, refresh?: boolean): Promise<Balance> => {
  let balance: Balance = { incoming: 0, outgoing: 0 };
  await Promise.all(
    account.external.addresses.map(async (address) => {
      const newBalance = await getBalanceFromAddress(address.address);
      balance.incoming = Number(balance.incoming) + Number(BitcoinToSatoshis(newBalance.incoming));
      balance.outgoing = Number(balance.outgoing) + Number(BitcoinToSatoshis(newBalance.outgoing));
    })
  );
  await Promise.all(
    account.internal.addresses.map(async (address) => {
      const newBalance = await getBalanceFromAddress(address.address);
      balance.incoming = Number(balance.incoming) + Number(BitcoinToSatoshis(newBalance.incoming));
      balance.outgoing = Number(balance.outgoing) + Number(BitcoinToSatoshis(newBalance.outgoing));
    })
  );
  return balance;
};

export const getBalanceFromAddress = async (address: string): Promise<Balance> => {
  const bitcoinService = new BitcoinService("TEST");
  return bitcoinService.getBalance(address, BitcoinProvider.TATUM);
};
