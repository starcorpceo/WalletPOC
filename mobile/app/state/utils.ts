import { selector } from "recoil";
import { KeyShareType, PurposeKeyShare } from "shared/types/mpc";
import { AuthState, authState } from "./atoms";

export const getPurposeWallet = selector({
  key: "GetPurposeWallet",
  get: ({ get }): PurposeKeyShare => {
    const auth = get<AuthState>(authState);

    const purposeWallet = auth.keyShares.find(
      (wallet) => wallet.parentWalletId === auth.bip44MasterKeyShare.id && wallet.type === KeyShareType.PURPOSE
    );

    if (!purposeWallet) throw new Error("Purpose Wallet does not exist!");

    return purposeWallet;
  },
});
