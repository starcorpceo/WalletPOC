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
  return new MPCSigner(address, user).connect(getPreparedProvider());
};

/**
 * Prepares Alchemy Provider without signer
 * @returns
 */
export const getPreparedProvider = (): ethers.providers.AlchemyProvider => {
  return new ethers.providers.AlchemyProvider(config.chain, alchemyProviderKey);
};
