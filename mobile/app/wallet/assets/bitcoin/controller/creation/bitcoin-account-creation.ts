import { User } from "api-types/user";
import { config } from "bitcoin/config/bitcoin-config";
import { defaultBitcoinAccountConfig } from "bitcoin/config/bitcoin-constants";
import { publicKeyToBitcoinAddressP2PKH } from "bitcoin/controller/adapter/bitcoin-adapter";
import { BitcoinWalletsState } from "bitcoin/state/atoms";
import { BitcoinWallet } from "bitcoin/types/bitcoin";
import { SetterOrUpdater } from "recoil";
import { CoinTypeKeyShare, PurposeKeyShare } from "shared/types/mpc";
import { AccountBuilder } from "wallet/controller/creation/account-creation";

export class BitcoinAccountBuilder extends AccountBuilder<BitcoinWallet> {
  private setState: SetterOrUpdater<BitcoinWalletsState> = () => {};

  constructor(user: User) {
    super(user, publicKeyToBitcoinAddressP2PKH, defaultBitcoinAccountConfig);
  }

  public async useSetState(setState: SetterOrUpdater<BitcoinWalletsState>) {
    this.setState = setState;
    return this;
  }

  /**
   * Uses or Sets up a CoinTypeShare for the new Account
   *
   * @param purposeShare Share from the Bip44 Purpose level
   * @param coinTypeShareFromState CoinTypeShare form the local state. Can be empty, in this case it has the values of initialBitcoinState
   * @returns
   */
  public async useCoinTypeShare(
    purposeShare: PurposeKeyShare,
    coinTypeShareFromState: CoinTypeKeyShare
  ): Promise<BitcoinAccountBuilder> {
    this.coinTypeKeyShare = await super.buildCoinTypeShare(
      purposeShare,
      coinTypeShareFromState,
      config.bip44BitcoinCoinType
    );

    this.setState((current) => ({
      ...current,
      coinTypeKeyShare: this.coinTypeKeyShare,
    }));

    return this;
  }
}
