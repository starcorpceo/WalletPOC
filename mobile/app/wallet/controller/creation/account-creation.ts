import { User } from "api-types/user";
import { config } from "bitcoin/config/bitcoin-config";
import { defaultBitcoinAccountConfig } from "bitcoin/config/bitcoin-constants";
import {
  assignNewDepositAddress,
  connectVirtualAccount,
} from "bitcoin/controller/bitcoin-virtual-wallet";
import { mpcPublicKeyToBitcoinAddress } from "bitcoin/controller/bitcoinjs-adapter";
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
import { deriveMpcKeyShare } from "./derived-share-creation";

/**
 * Utilizes Builder pattern to take (or create) a CoinTypeKeyShare and creates the Account all the way down to the Address level
 */
export class AccountBuilder {
  private user: User;
  private coinTypeKeyShare: CoinTypeKeyShare = emptyKeyPair;
  private accountKeyShare: AccountKeyShare = emptyKeyPair;
  private xPub = "";

  private internal: AccountChange = { keyShare: emptyKeyPair, addresses: [] };
  private external: AccountChange = { keyShare: emptyKeyPair, addresses: [] };
  private publicKeyToAddress: PublicKeyToAddress = () => "";

  private virtualAccount: VirtualAccount | undefined;

  /**
   *
   * @param user which is the owner of the new Account
   */
  constructor(user: User) {
    this.user = user;
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
  public async useCoinTypeShare(
    purposeShare: PurposeKeyShare,
    coinTypeShareFromState: CoinTypeKeyShare
  ): Promise<AccountBuilder> {
    const noCoinTypeWalletExists = deepCompare(
      coinTypeShareFromState,
      initialBitcoinState.coinTypeKeyShare
    );

    this.coinTypeKeyShare = noCoinTypeWalletExists
      ? await deriveMpcKeyShare(
          purposeShare,
          this.user,
          config.bip44BitcoinCoinType,
          true,
          KeyShareType.COINTYPE
        )
      : coinTypeShareFromState;

    return this;
  }

  /**
   * Creates Account Level KeyShare and xPub Key
   */
  public async createAccount(): Promise<AccountBuilder> {
    const accountKeyShare = await deriveMpcKeyShare(
      this.coinTypeKeyShare,
      this.user,
      "0",
      true,
      KeyShareType.ACCOUNT
    );

    const xPub = await getXPubKey(
      accountKeyShare.keyShare,
      config.IsTestNet ? "test" : "main"
    );

    const virtualAccount = await connectVirtualAccount(accountKeyShare);

    this.virtualAccount = virtualAccount;
    this.accountKeyShare = accountKeyShare;
    this.xPub = xPub;

    return this;
  }

  /**
   *
   * @param chain Defines which algorithm is used for creating addresses
   */
  public async forBlockchain(
    chain: "Bitcoin" | "Ethereum"
  ): Promise<AccountBuilder> {
    if (chain === "Bitcoin")
      this.publicKeyToAddress = mpcPublicKeyToBitcoinAddress;

    return this;
  }

  /**
   * Builds Change and Address KeyShares for a given changeType (internal or external)
   * @param changeType Defines if derivation index will be 0 or 1 e.g. if it is an internal or external Address Holder
   * @returns
   */
  public async createChange(
    changeType: "internal" | "external"
  ): Promise<AccountBuilder> {
    const index = changeType === "external" ? "0" : "1";

    const internalKeyShare = await deriveMpcKeyShare(
      this.accountKeyShare,
      this.user,
      index,
      false,
      KeyShareType.CHANGE
    );

    const internalAddressShare = await deriveMpcKeyShare(
      internalKeyShare,
      this.user,
      "0",
      false,
      KeyShareType.ADDRESS
    );

    this[changeType] = await this.createAccountChange(
      internalKeyShare,
      internalAddressShare,
      this.virtualAccount as VirtualAccount,
      this.publicKeyToAddress
    );

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

  private async createAccountChange(
    changeShare: ChangeKeyShare,
    addressShare: AddressKeyShare,
    virtualAccount: VirtualAccount,
    publicKeyToAddress: PublicKeyToAddress
  ): Promise<AccountChange> {
    const address = await createAddress(
      addressShare,
      virtualAccount,
      publicKeyToAddress
    );

    return {
      keyShare: changeShare,
      addresses: [address],
    };
  }
}

type PublicKeyToAddress = (publicKey: string) => string;

export const createAddress = async (
  addressShare: AddressKeyShare,
  virtualAccount: VirtualAccount,
  publicKeyToAddress: PublicKeyToAddress
): Promise<Address> => {
  const publicKey = await getPublicKey(addressShare.keyShare);
  const address = await publicKeyToAddress(publicKey);

  try {
    const virtualAddress = await assignNewDepositAddress(
      virtualAccount,
      address
    );
  } catch (err) {
    console.warn("Unable to assign address to virtual account");
  }

  return { keyShare: addressShare, publicKey, address };
};