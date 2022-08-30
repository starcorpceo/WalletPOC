import { GaslessTransactionResponse, TankAddressResponse } from "api-types/gasless";
import { User } from "api-types/user";
import { abi } from "ethereum/config/general-abi";
import { ERC20Token } from "ethereum/config/token-constants";
import { ethers } from "ethers";
import { fetchFromApi, HttpMethod } from "lib/http";
import { Address } from "wallet/types/wallet";
import { getPreparedMpcSigner } from "../signers/alchemy-signer";
import { usdcAbi } from "./usdc-abi";

export const gaslessOneTimeApprove = async (address: Address, user: User, value: string, token: ERC20Token) => {
  const mpcSigner = getPreparedMpcSigner(address, user);

  //fetch apis tank address
  const tankAddress = await fetchFromApi<TankAddressResponse>("/gasless/tankAddress");

  // Let api send ether to use in approval call
  const { transaction } = await fetchFromApi<GaslessTransactionResponse>("/gasless/approve", {
    method: HttpMethod.POST,
    body: {
      contractAddress: token.contractAddress,
      receiver: address.address,
    },
  });

  //approve token for unlimited amount
  const approvalResponse = await new ethers.Contract(token.contractAddress, usdcAbi, mpcSigner).approve(
    tankAddress.address,
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  );

  await approvalResponse.wait();
  if (approvalResponse) return true;
  else return false;
};
