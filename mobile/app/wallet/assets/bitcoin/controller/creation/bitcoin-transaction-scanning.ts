import { User } from "api-types/user";
import { bitcoinWalletsState, BitcoinWalletsState } from "bitcoin/state/atoms";
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import { CoinTypeState } from "state/types";
import { CreateAddress } from "wallet/controller/creation/address-creation";
import { CoinTypeAccount, Transaction } from "wallet/types/wallet";
import { BitcoinService } from "../../../../../../packages/blockchain-api-client/src";
import { BitcoinProvider } from "../../../../../../packages/blockchain-api-client/src/blockchains/bitcoin/bitcoin-factory";

/**
 * Loads all addresses which were already used in a transaction
 * @param user
 * @param account
 * @param setCoin
 */
export const getUsedAddresses = async <T extends CoinTypeAccount>(
  user: User,
  account: CoinTypeAccount,
  setCoin: SetterOrUpdater<CoinTypeState<T>>
) => {
  var isUnused = false;
  var derivationIndex = 0;
  while (!isUnused) {
    const newAddress = await CreateAddress({
      user,
      account,
      changeType: "external",
      setCoin: setCoin,
      derivationIndex,
    });
    const bitcoinService = new BitcoinService("TEST");
    const query = new URLSearchParams({
      pageSize: "1",
      offset: "0",
    });
    const transactions = await bitcoinService.getTransactions(newAddress.address, query, BitcoinProvider.TATUM);
    newAddress.transactions = transactions;

    const index =
      account.mpcKeyShare.path.slice(-1) === "'"
        ? Number(account.mpcKeyShare.path.slice(-2).slice(0, 1))
        : Number(account.mpcKeyShare.path.slice(-1));

    isUnused = transactions.length === 0;
    derivationIndex++;
  }

  isUnused = false;
  derivationIndex = 0;

  while (!isUnused) {
    const newAddress = await CreateAddress({
      user,
      account,
      changeType: "internal",
      setCoin: setCoin,
      derivationIndex,
    });
    const bitcoinService = new BitcoinService("TEST");
    const query = new URLSearchParams({
      pageSize: "1",
      offset: "0",
    });
    const transactions = await bitcoinService.getTransactions(newAddress.address, query, BitcoinProvider.TATUM);
    isUnused = transactions.length === 0;
    derivationIndex++;
  }
};
