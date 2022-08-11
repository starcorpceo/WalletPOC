import { CoinTypeKeyShare } from "shared/types/mpc";
import { CoinTypeAccount } from "wallet/types/wallet";

export type CoinTypeState<T extends CoinTypeAccount> = {
  coinTypeKeyShare: CoinTypeKeyShare;
  accounts: T[];
};
