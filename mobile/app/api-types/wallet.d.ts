export interface MPCWallet {
  id: string;
  path: string;
  keyShare: string;
  parentWalletId: string | null;
  xPub: string | undefined;
}
