import { Share } from "lib/mpc/shared";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CustomStorage } from "./storage";

const { persistAtom } = recoilPersist({ storage: CustomStorage });

export interface AuthState {
  devicePublicKey: string;
  userId: string;
  mainKeyShare: Share;
  genericSecret: Share;
}

export const initialAuthState: AuthState = {
  devicePublicKey: "",
  userId: "",
  mainKeyShare: {
    clientShare: "",
    serverShareId: "",
  },
  genericSecret: {
    clientShare: "",
    serverShareId: "",
  },
};

export const authState = atom({
  key: "authState",
  default: initialAuthState,
  effects_UNSTABLE: [persistAtom],
});
