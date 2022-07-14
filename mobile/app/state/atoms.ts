import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { User } from "../api-types/user";
import { CustomStorage } from "./storage";

const { persistAtom } = recoilPersist({
  storage: CustomStorage,
  key: "AuthStatePersist",
});

export type AuthState = User;

export const initialAuthState: AuthState = {
  devicePublicKey: "",
  id: "",
  wallets: [],
  bip44MasterWallet: undefined,
  bip44PurposeWallet: undefined,
};

export const authState = atom({
  key: "AuthState",
  default: initialAuthState,
  effects_UNSTABLE: [persistAtom],
});
