import { User } from "api-types/user";
import { config } from "bitcoin/config/bitcoin-config";
import { createAddress } from "wallet/controller/creation/address-creation";
import { Address, CoinTypeAccount } from "wallet/types/wallet";
import { BitcoinService } from "../../../../../../packages/blockchain-api-client/src";
import { BitcoinProvider } from "../../../../../../packages/blockchain-api-client/src/blockchains/bitcoin/bitcoin-factory";

/**
 * Loads all addresses which were already used in a transaction
 * @param user
 * @param account
 * @param changeType
 */
export const getUsedAddresses = async <T extends CoinTypeAccount>(
  user: User,
  account: CoinTypeAccount,
  changeType: "internal" | "external"
): Promise<Address[]> => {
  let isUnused = false;
  let derivationIndex = 0;
  let addresses: Address[] = [];
  while (!isUnused) {
    const newAddress = await createAddress(user, account, changeType, derivationIndex);

    const bitcoinService = new BitcoinService(config.IsTestNet ? "TEST" : "MAIN");
    const query = new URLSearchParams({
      pageSize: "10",
      offset: "0",
    });
    newAddress.transactions = await bitcoinService.getTransactions(newAddress.address, query, BitcoinProvider.TATUM);

    addresses.push(newAddress);

    isUnused = newAddress.transactions.length === 0;
    derivationIndex++;
  }
  return addresses;
};
