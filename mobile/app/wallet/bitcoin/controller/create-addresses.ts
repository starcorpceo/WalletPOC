import { User } from "api-types/user";
import { BitcoinWalletsState, initialBitcoinState } from "bitcoin/state/atoms";
import constants from "config/constants";
import { deepCompare } from "lib/string";
import { getPublicKey, getXPubKey } from "react-native-blockchain-crypto-mpc";
import {
  AccountKeyShare,
  AddressKeyShare,
  ChangeKeyShare,
  CoinTypeKeyShare,
  KeyShareType,
  PurposeKeyShare,
} from "shared/mpc";
import { deriveMpcKeyShare } from "wallet/controller/generator";
import { VirtualAccount, VirtualAddress } from "wallet/virtual-wallet";
import { WalletChange } from "wallet/wallet";
import { assignNewDepositAddress } from "./bitcoin-virtual-wallet";
import { mpcPublicKeyToBitcoinAddress } from "./bitcoinjs";

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

  const xPub = await getXPubKey(accountMpcKeyShare.keyShare, "test");

  return { bitcoinTypeKeyShare, account: { ...accountMpcKeyShare, xPub } };
};

export const createChangeKeyShare = async (
  user: User,
  accountShare: AccountKeyShare,
  virtualAccount: VirtualAccount,
  index: string
): Promise<WalletChange> => {
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
): Promise<AddressKeyShare> => {
  const addressShare = await deriveMpcKeyShare(
    changeShare,
    user,
    index,
    false,
    KeyShareType.ADDRESS
  );

  const publicKey = await getPublicKey(addressShare.keyShare);
  const address = await mpcPublicKeyToBitcoinAddress(publicKey);

  const tatumAddress: VirtualAddress = await assignNewDepositAddress(
    virtualAccount,
    address
  );

  return { ...addressShare, publicKey, address };
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
  if (
    deepCompare(
      state.coinTypeWallet.mpcKeyShare,
      initialBitcoinState.coinTypeWallet.mpcKeyShare
    )
  )
    return await deriveMpcKeyShare(
      PurposeKeyShare,
      user,
      constants.bip44BitcoinCoinType,
      true,
      KeyShareType.COINTYPE
    );

  return state.coinTypeWallet.mpcKeyShare;
};
