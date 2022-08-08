import { SetterOrUpdater } from "recoil";
import { KeyShareType } from "shared/types/mpc";
import { deriveMpcKeyShare } from "wallet/controller/creation/derived-share-creation";
import { CoinTypeAccount } from "wallet/types/wallet";
import { createAddress } from "./account-creation";
import { CoinTypeState } from "state/types";
import { getPublicKeyToAddressAdapter } from "../adapter/blockchain-adapter";
import { User } from "api-types/user";

interface CreateAddressProps<T extends CoinTypeAccount> {
  user: User;
  account: CoinTypeAccount;
  changeType: "internal" | "external";
  setCoin: SetterOrUpdater<CoinTypeState<T>>;
}

export const CreateAddress = async <T extends CoinTypeAccount>({
  user,
  account,
  changeType,
  setCoin,
}: CreateAddressProps<T>) => {
  const change = changeType === "external" ? account.external : account.internal;

  const newAddressShare = await deriveMpcKeyShare(
    change.keyShare,
    user,
    change.addresses.length.toString(),
    false,
    KeyShareType.ADDRESS
  );

  const newAddress = await createAddress(newAddressShare, getPublicKeyToAddressAdapter(account.config));

  const index =
    account.mpcKeyShare.path.slice(-1) === "'"
      ? Number(account.mpcKeyShare.path.slice(-2).slice(0, 1))
      : Number(account.mpcKeyShare.path.slice(-1));

  setCoin((current) => {
    return {
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
    };
  });
};
