import { SetterOrUpdater } from "recoil";
import { KeyShareType } from "shared/types/mpc";
import { deriveMpcKeyShare } from "wallet/controller/creation/derived-share-creation";
import { Address, CoinTypeAccount } from "wallet/types/wallet";
import { createAddress } from "./account-creation";
import { CoinTypeState } from "state/types";
import { getPublicKeyToAddressAdapter } from "../adapter/blockchain-adapter";
import { User } from "api-types/user";

interface CreateAddressProps<T extends CoinTypeAccount> {
  user: User;
  account: CoinTypeAccount;
  changeType: "internal" | "external";
  setCoin: SetterOrUpdater<CoinTypeState<T>>;
  derivationIndex?: Number;
}

export const CreateAddress = async <T extends CoinTypeAccount>({
  user,
  account,
  changeType,
  setCoin,
  derivationIndex,
}: CreateAddressProps<T>): Promise<Address> => {
  const change = changeType === "external" ? account.external : account.internal;

  const newAddressShare = await deriveMpcKeyShare(
    change.keyShare,
    user,
    derivationIndex ? derivationIndex.toString() : change.addresses.length.toString(),
    false,
    KeyShareType.ADDRESS
  );

  const newAddress = await createAddress(newAddressShare, getPublicKeyToAddressAdapter(account.config));

  const index =
    account.mpcKeyShare.path.slice(-1) === "'"
      ? Number(account.mpcKeyShare.path.slice(-2).slice(0, 1))
      : Number(account.mpcKeyShare.path.slice(-1));

  //TODO auto return external or internal
  setCoin((current) => {
    return changeType === "external"
      ? {
          ...current,
          accounts: [
            {
              ...current.accounts[index],
              external: {
                ...current.accounts[index].external,
                addresses: [...current.accounts[index].external.addresses, newAddress],
              },
            },
          ],
        }
      : {
          ...current,
          accounts: [
            {
              ...current.accounts[index],
              internal: {
                ...current.accounts[index].internal,
                addresses: [...current.accounts[index].internal.addresses, newAddress],
              },
            },
          ],
        };
  });

  return newAddress;
};
