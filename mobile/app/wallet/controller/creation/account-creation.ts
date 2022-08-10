import { User } from "api-types/user";
import { config } from "bitcoin/config/bitcoin-config";
import { defaultBitcoinAccountConfig } from "bitcoin/config/bitcoin-constants";
import { assignNewDepositAddress, connectVirtualAccount } from "bitcoin/controller/virtual/bitcoin-virtual-wallet";
import { BitcoinWalletsState, initialBitcoinState } from "bitcoin/state/atoms";
import { emptyKeyPair } from "config/constants";
import { deepCompare } from "lib/util";
import { getPublicKey, getXPubKey } from "react-native-blockchain-crypto-mpc";
import {
  AccountKeyShare,
  AddressKeyShare,
  ChangeKeyShare,
  CoinTypeKeyShare,
  KeyShareType,
  PurposeKeyShare,
} from "shared/types/mpc";
import { VirtualAccount } from "wallet/types/virtual-wallet";
import { AccountChange, Address } from "wallet/types/wallet";
import { AddressAndPublicKey } from "../adapter/blockchain-adapter";
import { deriveMpcKeyShare } from "./derived-share-creation";

type PublicKeyToAddress = (publicKey: string) => AddressAndPublicKey;

/**
 * Utilizes Builder pattern to take (or create) a CoinTypeKeyShare and creates the Account all the way down to the Address level
 */
export class AccountBuilder {
  private xPub = "";

  private internal: AccountChange = { keyShare: emptyKeyPair, addresses: [] };
  private external: AccountChange = { keyShare: emptyKeyPair, addresses: [] };
  private publicKeyToAddress: PublicKeyToAddress;

  protected user: User;
  protected coinTypeKeyShare: CoinTypeKeyShare = emptyKeyPair;
  protected accountKeyShare: AccountKeyShare = emptyKeyPair;

  virtualAccount: VirtualAccount | undefined;

  /**
   *
   * @param user which is the owner of the new Account
   */
  constructor(user: User, publicKeyToAddress: PublicKeyToAddress) {
    this.user = user;
    this.publicKeyToAddress = publicKeyToAddress;
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
    coinTypeShareFromState: CoinTypeKeyShare
  ): Promise<CoinTypeKeyShare> {
    const noCoinTypeWalletExists = deepCompare(coinTypeShareFromState, initialBitcoinState.coinTypeKeyShare);

    return noCoinTypeWalletExists
      ? await deriveMpcKeyShare(purposeShare, this.user, config.bip44BitcoinCoinType, true, KeyShareType.COINTYPE)
      : coinTypeShareFromState;
  }

  /**
   * Creates Account Level KeyShare and xPub Key
   */
  public async createAccount(): Promise<AccountBuilder> {
    const accountKeyShare = await deriveMpcKeyShare(this.coinTypeKeyShare, this.user, "0", true, KeyShareType.ACCOUNT);

    const xPub = await getXPubKey(accountKeyShare.keyShare, config.IsTestNet ? "test" : "main");

    //const virtualAccount = await connectVirtualAccount(accountKeyShare);

    //this.virtualAccount = virtualAccount;
    this.accountKeyShare = accountKeyShare;
    this.xPub = xPub;

    return this;
  }

  //TODO derive as many addresses as there are already in use - but in bitcoin specific file
  /**
   * Builds Change KeyShares for a given changeType (internal or external)
   * @param changeType Defines if derivation index will be 0 or 1 e.g. if it is an internal or external Address Holder
   * @returns
   */
  public async createChange(changeType: "internal" | "external"): Promise<AccountBuilder> {
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
  public async build(): Promise<BitcoinWalletsState> {
    return {
      coinTypeKeyShare: this.coinTypeKeyShare,
      accounts: [
        {
          mpcKeyShare: this.accountKeyShare,
          virtualAccount: this.virtualAccount as VirtualAccount,
          xPub: this.xPub,
          internal: this.internal,
          external: this.external,
          config: defaultBitcoinAccountConfig,
          balance: { incoming: 0, outgoing: 0 },
          transactions: [],
        },
      ],
    };
  }

  // private async createAccountChange(
  //   changeShare: ChangeKeyShare,
  //   addressShare: AddressKeyShare,
  //   virtualAccount: VirtualAccount,
  //   publicKeyToAddress: PublicKeyToAddress
  // ): Promise<AccountChange> {
  //   const address = await createAddress(
  //     addressShare,
  //     virtualAccount,
  //     publicKeyToAddress
  //   );

  //   return {
  //     keyShare: changeShare,
  //     addresses: [address],
  //   };
  // }
}
