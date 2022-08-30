import { User } from "api-types/user";
import { alchemyProviderKey, config } from "ethereum/config/ethereum-config";
import { ethers } from "ethers";
import { Address } from "wallet/types/wallet";
import { MPCSigner } from "../zksync/signer";

/**
 * Prepares mpc Signer with Alchemy Provider
 * @param address
 * @param user
 * @returns
 */
export const getPreparedMpcSigner = (address: Address, user: User): MPCSigner => {
  const provider = new ethers.providers.AlchemyProvider(config.chain, alchemyProviderKey);
  return new MPCSigner(address, user).connect(provider);
};
