import { User } from "api-types/user";
import { config } from "bitcoin/config/bitcoin-config";
import { BitcoinWalletsState, initialBitcoinState } from "bitcoin/state/atoms";
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
import { AccountChange, Address } from "wallet/types/wallet";
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
  index: string
): Promise<AccountChange> => {
  const change = await deriveMpcKeyShare(
    accountShare,
    user,
    index,
    false,
    KeyShareType.CHANGE
  );

  const address = await createAddressShare(change, user, "0");

  return {
    keyShare: change,
    addresses: [address],
  };
};

export const createAddressShare = async (
  changeShare: ChangeKeyShare,
  user: User,
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
  const address = await mpcPublicKeyToBitcoinAddress(publicKey);

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
  console.log("comparing", {
    current: state.coinTypeWallet,
    initial: initialBitcoinState.coinTypeWallet,
  });
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
