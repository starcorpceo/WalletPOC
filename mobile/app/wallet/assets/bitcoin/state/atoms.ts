import { BitcoinWallet } from "bitcoin/types/bitcoin";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CoinTypeKeyShare, KeyShareType } from "shared/types/mpc";
import { CustomStorage } from "state/storage";

const { persistAtom } = recoilPersist({
  storage: CustomStorage,
  key: "BitcoinWalletsStatePersist",
});

export type BitcoinWalletsState = {
  coinTypeWallet: CoinTypeKeyShare;
  accounts: BitcoinWallet[];
};

const emptyCoinTypeShare: CoinTypeKeyShare = {
  id: "",
  keyShare: "",
  path: "",
  parentWalletId: "",
  type: KeyShareType.COINTYPE,
};

export const initialBitcoinState: BitcoinWalletsState = {
  accounts: [],
  coinTypeWallet: emptyCoinTypeShare,
};

export const bitcoinWalletsState = atom({
  key: "BitcoinWallets",
  default: initialBitcoinState,
  effects_UNSTABLE: [persistAtom],
});

// export const useUpdateBitcoinAccountWallet = (
//   updater: () => Promise<BitcoinWallet>
// ) => {
//   const [bitcoinState, setBitcoinState] =
//     useRecoilState<BitcoinWalletsState>(bitcoinWalletsState);

//   return async function WithBitcoinState() {
//     const updatedWallet = await updater();

//     const index = bitcoinState.accounts.findIndex(
//       (findWallet) => findWallet.mpcWallet.id === updatedWallet.mpcWallet.id
//     );

//     setBitcoinState((currentState) => ({
//       ...currentState,
//       accounts: [
//         ...currentState.accounts.slice(0, index),
//         updatedWallet,
//         ...currentState.accounts.slice(index + 1),
//       ],
//     }));
//   };
// };
