import { ethers } from "ethers";
import { TankAddressResponse, TankBalanceResponse } from "./gasless";

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
