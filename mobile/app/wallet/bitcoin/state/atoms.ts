import { config } from "config/config";
import { emptyMPCWallet } from "config/constants";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CustomStorage } from "state/storage";
import { CoinTypeWallet } from "wallet/wallet";
import { BitcoinWallet } from "..";

const { persistAtom } = recoilPersist({
  storage: CustomStorage,
  key: "BitcoinWalletsStatePersist",
});

export type BitcoinWalletsState = {
  coinTypeWallet: CoinTypeWallet;
  accounts: BitcoinWallet[];
};

export const initialBitcoinState: BitcoinWalletsState = {
  accounts: [],
  coinTypeWallet: {
    mpcWallet: emptyMPCWallet,
    config: {
      symbol: "BTC",
      name: "Bitcoin",
      chain: "Bitcoin",
      isTestnet: config.IsTestNet,
    },
    virtualAccount: {
      id: "",
      balance: 0,
      currency: "",
      frozen: false,
      active: false,
    },
  },
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
