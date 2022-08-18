import { TransactionRequest } from "@ethersproject/abstract-provider";
import { ERC20Token } from "ethereum/config/token-constants";
import { ethers } from "ethers";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import { MPCSigner } from "./zksync/signer";

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

export const buildRawTokenTransaction = async (
  abi: any,
  contractAddress: string,
  to: string,
  value: number,
  txCount: string,
  gasPrice: string,
  token: ERC20Token,
  signer: MPCSigner,
  service: EthereumService
): Promise<TransactionRequest> => {
  const erc20_rw = new ethers.Contract(contractAddress, abi, signer);

  const unsignedTrans = await erc20_rw.populateTransaction.transfer(to, (value * 10 ** token.decimals).toString());

  const gas = await service.getEstimatedFees(
    unsignedTrans.from!,
    to,
    unsignedTrans.data!,
    EthereumProviderEnum.ALCHEMY
  );

  const txData: TransactionRequest = {
    nonce: txCount,
    gasLimit: Number.parseInt(gas, 16) + 65000, //80000 have to be replaced with calulated value
    gasPrice: gasPrice,
    to: contractAddress, // token contract address
    value: ethers.constants.AddressZero, // no ether value - here address zero because its the same value
    data: unsignedTrans.data,
    chainId: 5,
  };

  return txData;
};
