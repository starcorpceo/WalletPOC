import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { User } from "../api-types/user";
import { CustomStorage } from "./storage";

const { persistAtom } = recoilPersist({ storage: CustomStorage });

export type AuthState = User;

export const initialAuthState: AuthState = {
  devicePublicKey: "",
  id: "",
  wallets: [],
  masterWallet: undefined,
};

export const authState = atom({
  key: "AuthState",
  default: initialAuthState,
  effects_UNSTABLE: [persistAtom],
});
