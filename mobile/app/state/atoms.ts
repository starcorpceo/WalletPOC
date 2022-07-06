import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CustomStorage } from "./storage";

const { persistAtom } = recoilPersist({ storage: CustomStorage });

export interface AuthState {
  devicePublicKey: string;
  userId: string;
  mainKeyShare: string;
  genericSecret: string;
}

export const initialAuthState: AuthState = {
  devicePublicKey: "",
  userId: "",
  mainKeyShare: "",
  genericSecret: "",
};

export const authState = atom({
  key: "authState",
  default: initialAuthState,
  effects_UNSTABLE: [persistAtom],
});
