import { AddressKeyShare, KeyShareType } from "shared/types/mpc";
import { deriveMpcKeyShare } from "wallet/controller/creation/derived-share-creation";
import { Address, CoinTypeAccount } from "wallet/types/wallet";
import { getPublicKeyToAddressAdapter } from "../adapter/blockchain-adapter";
import { User } from "api-types/user";
import { VirtualAccount } from "wallet/types/virtual-wallet";
import { getPublicKey } from "react-native-blockchain-crypto-mpc";
import { assignNewDepositAddress } from "bitcoin/controller/virtual/bitcoin-virtual-wallet";

export const createAddress = async <T extends CoinTypeAccount>(
  user: User,
  account: CoinTypeAccount,
  changeType: "internal" | "external",
  derivationIndex?: Number
): Promise<Address> => {
  const change = changeType === "external" ? account.external : account.internal;

  const newAddressShare = await deriveMpcKeyShare(
    change.keyShare,
    user,
    derivationIndex ? derivationIndex.toString() : change.addresses.length.toString(),
    false,
    KeyShareType.ADDRESS
  );

  const newAddress = await transformPublicKey(newAddressShare, getPublicKeyToAddressAdapter(account.config));

  return newAddress;
};

type PublicKeyToAddress = (publicKey: string) => string;

const transformPublicKey = async (
  addressShare: AddressKeyShare,
  publicKeyToAddress: PublicKeyToAddress,
  virtualAccount?: VirtualAccount
): Promise<Address> => {
  const publicKey = await getPublicKey(addressShare.keyShare);
  const address = await publicKeyToAddress(publicKey);

  virtualAccount && assignVirtualAccount(virtualAccount, address);

  return { keyShare: addressShare, publicKey, address, transactions: [], balance: { incoming: 0, outgoing: 0 } };
};

const assignVirtualAccount = async (virtualAccount: VirtualAccount, address: string) => {
  try {
    const virtualAddress = await assignNewDepositAddress(virtualAccount, address);
  } catch (err) {
    console.warn("Unable to assign address to virtual account");
  }
};
