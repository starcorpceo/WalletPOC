import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CustomStorage } from "state/storage";
import { BitcoinWallet } from "..";
import { MPCWallet } from "../../../api-types/wallet";

const { persistAtom } = recoilPersist({
  storage: CustomStorage,
  key: "BitcoinWalletsStatePersist",
});

export type BitcoinWalletsState = {
  coinTypeWallet: MPCWallet | undefined;
  accounts: BitcoinWallet[];
};

export const initialBitcoinState: BitcoinWalletsState = {
  accounts: [],
  coinTypeWallet: undefined,
};

export const bitcoinWalletsState = atom({
  key: "BitcoinWallets",
  default: initialBitcoinState,
  effects_UNSTABLE: [persistAtom],
});

export const useUpdateBitcoinAccountWallet = (
  updater: () => Promise<BitcoinWallet>
) => {
  const [bitcoinState, setBitcoinState] =
    useRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

  return async function WithBitcoinState() {
    const updatedWallet = await updater();

    const index = bitcoinState.accounts.findIndex(
      (findWallet) => findWallet.mpcWallet.id === updatedWallet.mpcWallet.id
    );

    setBitcoinState((currentState) => ({
      ...currentState,
      accounts: [
        ...currentState.accounts.slice(0, index),
        updatedWallet,
        ...currentState.accounts.slice(index + 1),
      ],
    }));
  };
};
