import { other, RouteError } from "@lib/error";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";
import { erc20Abi } from "./erc20-abi";
import {
  GaslessPermitRequest,
  GaslessTransactionResponse,
  GaslessTransferRequest,
  TankAddressResponse,
  TankBalanceResponse,
} from "./gasless";

const paymasterProvider = new ethers.providers.AlchemyProvider("goerli", "ahl42ynne2Kd8FosnoYBtCW3ssoCtIu0");

const paymasterAccount = ethers.utils.HDNode.fromMnemonic(
  "verify twice old trouble merge spot sorry doctor topple naive rent horse tumble wheat angle secret plate crane warfare chase run cereal match scissors"
).derivePath(`m/44'/60'/0'/0/0`);

const paymasterWallet = new ethers.Wallet(paymasterAccount, paymasterProvider);

export const fetchTankBalance = async (): Promise<TankBalanceResponse> => {
  return { balance: await paymasterWallet.getBalance() };
};

export const fetchTankAddress = (): TankAddressResponse => {
  return { address: paymasterWallet.address };
};

export const relayGaslessPermit = (
  request: GaslessPermitRequest
): ResultAsync<GaslessTransactionResponse, RouteError> => {
  //token contract connected with paymasters signer
  const tokenContract = new ethers.Contract(request.contractAddress, erc20Abi, paymasterWallet);
  return ResultAsync.fromPromise(
    tokenContract.permit(
      request.owner,
      request.spender,
      request.value,
      request.deadline,
      request.v,
      request.r,
      request.s
    ),
    (e) => other("Err while relaying gasless permit", e as Error)
  ).map((transaction) => {
    console.log("Permit transaction: ", transaction);
    return { transaction };
  });
};

export const relayGaslessTransfer = (
  request: GaslessTransferRequest
): ResultAsync<GaslessTransactionResponse, RouteError> => {
  //token contract connected with paymasters signer
  const tokenContract = new ethers.Contract(request.contractAddress, erc20Abi, paymasterWallet);
  return ResultAsync.fromPromise(tokenContract.transferFrom(request.from, request.to, request.value), (e) =>
    other("Err while relaying gasless transferFrom", e as Error)
  ).map((transaction) => {
    console.log("TransferFrom transaction: ", transaction);
    return { transaction };
  });
};
