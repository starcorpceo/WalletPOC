export const BitcoinToSatoshis = (btc: number): number => {
  return btc * 100000000;
};

export const SatoshisToBitcoin = (satoshis: number): number => {
  return satoshis / 100000000;
};
