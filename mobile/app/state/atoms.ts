import { User } from "api-types/user";
import { emptyMasterKeyPair } from "config/constants";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CustomStorage } from "./storage";

const { persistAtom } = recoilPersist({
  storage: CustomStorage,
  key: "AuthStatePersist",
});

export type AuthState = User;

export const initialAuthState: AuthState = {
  devicePublicKey: "",
  id: "",
  keyShares: [],
  bip44MasterKeyShare: emptyMasterKeyPair,
};

export const authState = atom({
  key: "AuthState",
  default: initialAuthState,
  effects_UNSTABLE: [persistAtom],
});
