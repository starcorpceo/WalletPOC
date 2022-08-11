import { User } from "api-types/user";
import { BitcoinService } from "packages/blockchain-api-client/src";
import { BitcoinProviderEnum } from "packages/blockchain-api-client/src/blockchains/bitcoin/bitcoin-factory";
import { createAddress } from "wallet/controller/creation/address-creation";
import { Address, CoinTypeAccount } from "wallet/types/wallet";

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
      const transactions = await bitcoinService.getTransactions(address.address, query, BitcoinProviderEnum.TATUM);
      isUsed = transactions.length == 0 ? false : true;
    } else {
      const transactions = await bitcoinService.getTransactions(
        account[chainType].addresses[currentIndex].address,
        query,
        BitcoinProviderEnum.TATUM
      );
      address = account[chainType].addresses[currentIndex];
      isUsed = transactions.length == 0 ? false : true;
    }
    currentIndex++;
  }
  return address as Address;
};
