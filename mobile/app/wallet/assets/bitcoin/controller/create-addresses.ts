import { CreateNonceResponse } from "api-types/auth";
import { CreateTatumConnectionResponse } from "api-types/tatum";
import { User } from "api-types/user";
import { config } from "bitcoin/config/bitcoin-config";
import { BitcoinWalletsState, initialBitcoinState } from "bitcoin/state/atoms";
import { Http2ServerRequest } from "http2";
import { signWithDeviceKeyNoAuth } from "lib/auth";
import { fetchFromApi, HttpMethod } from "lib/http";
import { deepCompare } from "lib/util";
import { getPublicKey } from "react-native-blockchain-crypto-mpc";
import {
  AccountKeyShare,
  ChangeKeyShare,
  CoinTypeKeyShare,
  KeyShareType,
  PurposeKeyShare,
} from "shared/types/mpc";
import { deriveMpcKeyShare } from "wallet/controller/generator";
import { VirtualAccount } from "wallet/types/virtual-wallet";
import { AccountChange, Address } from "wallet/types/wallet";
import { assignNewDepositAddress } from "./bitcoin-virtual-wallet";
import { mpcPublicKeyToBitcoinAddress } from "./bitcoinjs-adapter";

export const createBitcoinAccount = async (
  bitcoinState: BitcoinWalletsState,
  user: User,
  purposeWallet: PurposeKeyShare
) => {
  if (walletExists(bitcoinState)) {
    return;
  }

  const bitcoinTypeKeyShare = await getBitcoinTypeKeyShare(
    bitcoinState,
    user,
    purposeWallet
  );

  const newIndex = bitcoinState.accounts.length;

  const accountMpcKeyShare = await deriveMpcKeyShare(
    bitcoinTypeKeyShare,
    user,
    newIndex.toString(),
    true,
    KeyShareType.ACCOUNT
  );

  return { bitcoinTypeKeyShare, accountMpcKeyShare };
};

export const createChangeKeyShare = async (
  user: User,
  accountShare: AccountKeyShare,
  virtualAccount: VirtualAccount,
  index: string
): Promise<AccountChange> => {
  const change = await deriveMpcKeyShare(
    accountShare,
    user,
    index,
    false,
    KeyShareType.CHANGE
  );

  const address = await createAddressShare(change, user, virtualAccount, "0");

  return {
    keyShare: change,
    addresses: [address],
  };
};

export const createAddressShare = async (
  changeShare: ChangeKeyShare,
  user: User,
  virtualAccount: VirtualAccount,
  index: string
): Promise<Address> => {
  const addressShare = await deriveMpcKeyShare(
    changeShare,
    user,
    index,
    false,
    KeyShareType.ADDRESS
  );

  const publicKey = await getPublicKey(addressShare.keyShare);
  const address = mpcPublicKeyToBitcoinAddress(publicKey);

  try {
    const virtualAddress = assignNewDepositAddress(virtualAccount, address);
  } catch (err) {
    console.warn("Unable to assign address to virtual account");
  }

  return { keyShare: addressShare, publicKey, address };
};

const walletExists = (bitcoinState: BitcoinWalletsState): boolean =>
  bitcoinState &&
  !!bitcoinState?.coinTypeWallet &&
  bitcoinState.accounts.length > 0;

const getBitcoinTypeKeyShare = async (
  state: BitcoinWalletsState,
  user: User,
  PurposeKeyShare: PurposeKeyShare
): Promise<CoinTypeKeyShare> => {
  if (deepCompare(state.coinTypeWallet, initialBitcoinState.coinTypeWallet))
    return await deriveMpcKeyShare(
      PurposeKeyShare,
      user,
      config.bip44BitcoinCoinType,
      true,
      KeyShareType.COINTYPE
    );

  return state.coinTypeWallet;
};
