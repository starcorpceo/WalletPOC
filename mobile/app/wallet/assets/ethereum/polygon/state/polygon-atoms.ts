import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { CustomStorage } from "state/storage";
import { PolygonERC20Token } from "../config/tokens";

const { persistAtom } = recoilPersist({
  storage: CustomStorage,
  key: "PolygonStatePersist",
});

export type PendingTransaction = {
  hash: string;
  token: PolygonERC20Token;
  amount: string;
  checkpointed: boolean;
};

export type PolygonState = {
  withdrawTransactions: PendingTransaction[];
};

export const initialPolygonState: PolygonState = {
  withdrawTransactions: [],
};

export const polygonState = atom<PolygonState>({
  key: "PolygonState",
  default: initialPolygonState,
  effects_UNSTABLE: [persistAtom],
});
