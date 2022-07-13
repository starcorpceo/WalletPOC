export interface Wallet {
  id: string;
  path: string;
  keyShare: string;
  parentWalletId: string | null;
}
