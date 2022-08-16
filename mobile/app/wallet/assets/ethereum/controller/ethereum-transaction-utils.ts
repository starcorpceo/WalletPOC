import { TransactionRequest } from "@ethersproject/abstract-provider";

// const tryZkSync = async (address: Address, user: User) => {
//   const syncProvider = await zksync.getDefaultProvider("goerli");

//   const ethersProvider = ethers.getDefaultProvider("goerli");
//   const ethWallet2 = ethers.Wallet.fromMnemonic("MNEMONIC").connect(ethersProvider);

//   ethWallet2.signTransaction();

//   const ethWallet = new MPCSigner(address, user).connect(ethersProvider);

//   ethWallet.signMessage("asdf");

//   const syncWallet = zksync.Wallet.fromEthSigner(ethWallet, syncProvider);
// };

export const buildRawTransaction = (
  to: string,
  value: number,
  txCount: string,
  gasPrice: string
): TransactionRequest => {
  const txData: TransactionRequest = {
    nonce: txCount,
    to,
    value: "0x" + value.toString(16),
    gasPrice,
    gasLimit: "0x5208",
    chainId: 5,
  };

  return txData;
};
