import { User } from "api-types/user";
import { createAddress } from "wallet/controller/creation/address-creation";
import { Address, CoinTypeAccount } from "wallet/types/wallet";
import { BitcoinService } from "../../../../../packages/blockchain-api-client/src";
import { BitcoinProvider } from "../../../../../packages/blockchain-api-client/src/blockchains/bitcoin/bitcoin-factory";

export const getNextUnusedAddress = async (user: User, account: CoinTypeAccount): Promise<Address> => {
  const bitcoinService = new BitcoinService("TEST");
  const query = new URLSearchParams({
    pageSize: "1",
    offset: "0",
  });

  let currentIndex = account.external.addresses.length - 2; // -2 because index will be increased before first api query
  let isUsed = true;
  let address;

  while (isUsed) {
    currentIndex++;
    if (currentIndex >= account.external.addresses.length) {
      address = await createAddress(user, account, "external");
      const transactions = await bitcoinService.getTransactions(address.address, query, BitcoinProvider.TATUM);
      isUsed = transactions.length == 0 ? false : true;
    } else {
      const transactions = await bitcoinService.getTransactions(
        account.external.addresses[currentIndex].address,
        query,
        BitcoinProvider.TATUM
      );
      address = account.external.addresses[currentIndex];
      isUsed = transactions.length == 0 ? false : true;
    }
  }
  return address as Address;
};
