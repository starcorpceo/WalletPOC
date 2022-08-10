import { User } from "api-types/user";
import { BitcoinWalletsState } from "bitcoin/state/atoms";
import { SetterOrUpdater } from "recoil";
import { CoinTypeKeyShare, PurposeKeyShare } from "shared/types/mpc";
import { AccountBuilder } from "wallet/controller/creation/account-creation";
import { publicKeyToBitcoinAddressP2PKH } from "bitcoin/controller/adapter/bitcoin-adapter";

export class BitcoinAccountBuilder extends AccountBuilder {
  private setState: SetterOrUpdater<BitcoinWalletsState> = () => {};

  constructor(user: User) {
    super(user, publicKeyToBitcoinAddressP2PKH);
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
    this.coinTypeKeyShare = await super.buildCoinTypeShare(purposeShare, coinTypeShareFromState);

    this.setState((current) => ({
      ...current,
      coinTypeKeyShare: this.coinTypeKeyShare,
    }));

    return this;
  }
}
