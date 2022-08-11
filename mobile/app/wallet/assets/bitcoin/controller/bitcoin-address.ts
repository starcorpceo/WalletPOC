import { User } from "api-types/user";
import { createAddress } from "wallet/controller/creation/address-creation";
import { Address, CoinTypeAccount, Transaction } from "wallet/types/wallet";
import { BitcoinService } from "../../../../../packages/blockchain-api-client/src";
import { BitcoinProvider } from "../../../../../packages/blockchain-api-client/src/blockchains/bitcoin/bitcoin-factory";

//TODO also check if index-1 is used
export const getNextUnusedAddress = async (
  user: User,
  account: CoinTypeAccount,
  chainType: "external" | "internal"
): Promise<Address> => {
  const bitcoinService = new BitcoinService("TEST");
  const query = new URLSearchParams({
    pageSize: "1",
    offset: "0",
  });

  let currentIndex = account[chainType].addresses.length - 1;
  if (currentIndex < 0) currentIndex = 0;
  let isUsed = true;
  let address;

  while (isUsed) {
    if (currentIndex >= account[chainType].addresses.length) {
      address = await createAddress(user, account, chainType, currentIndex);
      const transactions = await bitcoinService.getTransactions(address.address, query, BitcoinProvider.TATUM);
      isUsed = transactions.length == 0 ? false : true;
    } else {
      const transactions = await bitcoinService.getTransactions(
        account[chainType].addresses[currentIndex].address,
        query,
        BitcoinProvider.TATUM
      );
      address = account[chainType].addresses[currentIndex];
      isUsed = transactions.length == 0 ? false : true;
    }
    currentIndex++;
  }
  return address as Address;
};
