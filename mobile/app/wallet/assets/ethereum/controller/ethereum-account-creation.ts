import { User } from "api-types/user";
import { defaultEthereumAccountConfig } from "ethereum/config/ethereum-constants";
import { EthereumWalletsState } from "ethereum/state/ethereum-atoms";
import { EthereumWallet } from "ethereum/types/ethereum";
import { SetterOrUpdater } from "recoil";
import { CoinTypeKeyShare, PurposeKeyShare } from "shared/types/mpc";
import { AccountBuilder } from "wallet/controller/creation/account-creation";
import { createAddress } from "wallet/controller/creation/address-creation";
import { publicKeyToEthereumAddress } from "./ethereum-adapter";

export class EthereumAccountBuilder extends AccountBuilder<EthereumWallet> {
  private setState: SetterOrUpdater<EthereumWalletsState> = () => {};

  constructor(user: User) {
    super(user, publicKeyToEthereumAddress, defaultEthereumAccountConfig);
  }

  public async useSetState(setState: SetterOrUpdater<EthereumWalletsState>) {
    this.setState = setState;
    return this;
  }

  /**
   * Uses or Sets up a CoinTypeShare for the new Account
   *
   * @param purposeShare Share from the Bip44 Purpose level
   * @param coinTypeShareFromState CoinTypeShare form the local state. Can be empty, in this case it has the values of initialEthereumState
   * @returns
   */
  public async useCoinTypeShare(
    purposeShare: PurposeKeyShare,
    coinTypeShareFromState: CoinTypeKeyShare
  ): Promise<EthereumAccountBuilder> {
    this.coinTypeKeyShare = await super.buildCoinTypeShare(purposeShare, coinTypeShareFromState, "60");

    this.setState((current) => ({
      ...current,
      coinTypeKeyShare: this.coinTypeKeyShare,
    }));

    return this;
  }

  public async build(): Promise<EthereumWalletsState> {
    const newState = await super.build();

    const createdAccount = newState.accounts[0];

    const address = await createAddress(this.user, createdAccount, "external", 0);

    const stateWithAccount: EthereumWalletsState = {
      ...newState,
      accounts: [
        { ...createdAccount, external: { ...createdAccount.external, addresses: [{ ...address, balance: 0 }] } },
      ],
    };

    return stateWithAccount;
  }
}
