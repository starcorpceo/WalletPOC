import { User } from "api-types/user";
import { config } from "bitcoin/config/bitcoin-config";
import { connectVirtualAccount } from "bitcoin/controller/virtual/bitcoin-virtual-wallet";
import { emptyKeyPair } from "config/constants";
import { deepCompare } from "lib/util";
import { getXPubKey } from "react-native-blockchain-crypto-mpc";
import { AccountKeyShare, CoinTypeKeyShare, KeyShareType, PurposeKeyShare } from "shared/types/mpc";
import { CoinTypeState } from "state/types";
import { initialCoinState } from "wallet/state/wallet-state-utils";
import { VirtualAccount } from "wallet/types/virtual-wallet";
import { AccountChange, CoinTypeAccount, WalletConfig } from "wallet/types/wallet";
import { AddressAndPublicKey } from "../adapter/blockchain-adapter";
import { deriveMpcKeyShare } from "./derived-share-creation";

type PublicKeyToAddress = (publicKey: string) => AddressAndPublicKey;

/**
 * Utilizes Builder pattern to take (or create) a CoinTypeKeyShare and creates the Account all the way down to the Address level
 */
export class AccountBuilder<T extends CoinTypeAccount> {
  private xPub = "";

  private internal: AccountChange = { keyShare: emptyKeyPair, addresses: [] };
  private external: AccountChange = { keyShare: emptyKeyPair, addresses: [] };
  private publicKeyToAddress: PublicKeyToAddress;
  private config: WalletConfig;

  protected user: User;
  protected coinTypeKeyShare: CoinTypeKeyShare = emptyKeyPair;
  protected accountKeyShare: AccountKeyShare = emptyKeyPair;

  virtualAccount: VirtualAccount | undefined;

  /**
   *
   * @param user which is the owner of the new Account
   */
  constructor(user: User, publicKeyToAddress: PublicKeyToAddress, config: WalletConfig) {
    this.user = user;
    this.publicKeyToAddress = publicKeyToAddress;
    this.config = config;
  }

  /**
   *  Initiating by creating a Tatum virtualAccount
   * */
  public async init() {
    return await this;
  }

  /**
   * Uses or Sets up a CoinTypeShare for the new Account
   *
   * @param purposeShare Share from the Bip44 Purpose level
   * @param coinTypeShareFromState CoinTypeShare form the local state. Can be empty, in this case it has the values of initialBitcoinState
   * @returns
   */
  protected async buildCoinTypeShare(
    purposeShare: PurposeKeyShare,
    coinTypeShareFromState: CoinTypeKeyShare,
    index: string
  ): Promise<CoinTypeKeyShare> {
    const noCoinTypeWalletExists = deepCompare(coinTypeShareFromState, initialCoinState.coinTypeKeyShare);

    return noCoinTypeWalletExists
      ? await deriveMpcKeyShare(purposeShare, this.user, index, true, KeyShareType.COINTYPE)
      : coinTypeShareFromState;
  }

  /**
   * Creates Account Level KeyShare and xPub Key
   */
  public async createAccount(createVirtual: boolean): Promise<AccountBuilder<T>> {
    const accountKeyShare = await deriveMpcKeyShare(this.coinTypeKeyShare, this.user, "0", true, KeyShareType.ACCOUNT);

    const xPub = await getXPubKey(accountKeyShare.keyShare, config.IsTestNet ? "test" : "main");

    if (createVirtual) {
      const virtualAccount = await connectVirtualAccount(accountKeyShare);
      this.virtualAccount = virtualAccount;
    }

    this.accountKeyShare = accountKeyShare;
    this.xPub = xPub;

    return this;
  }

  /**
   * Builds Change KeyShares for a given changeType (internal or external)
   * @param changeType Defines if derivation index will be 0 or 1 e.g. if it is an internal or external Address Holder
   * @returns
   */
  public async createChange(changeType: "internal" | "external"): Promise<AccountBuilder<T>> {
    const index = changeType === "external" ? "0" : "1";

    const changeKeyShare = await deriveMpcKeyShare(this.accountKeyShare, this.user, index, false, KeyShareType.CHANGE);

    this[changeType] = {
      keyShare: changeKeyShare,
      addresses: [],
    };

    return this;
  }

  /**
   *
   * @returns A BitcoinWalletState with a newly Set up Account
   */
  public async build(): Promise<CoinTypeState<CoinTypeAccount>> {
    const account = {
      mpcKeyShare: this.accountKeyShare,
      virtualAccount: this.virtualAccount,
      xPub: this.xPub,
      internal: this.internal,
      external: this.external,
      config: this.config,
      balance: { incoming: 0, outgoing: 0 },
      transactions: [],
    };

    return {
      coinTypeKeyShare: this.coinTypeKeyShare,
      accounts: [account],
    };
  }
}
