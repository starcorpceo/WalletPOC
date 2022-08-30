import { abi as ERC20ABI } from "@uniswap/v2-core/build/ERC20.json";
import { GaslessTransactionResponse, TankAddressResponse } from "api-types/gasless";
import { User } from "api-types/user";
import { alchemyProviderKey, config } from "ethereum/config/ethereum-config";
import { ERC20Token } from "ethereum/config/token-constants";
import { BigNumberish, ethers } from "ethers";
import { defaultAbiCoder, keccak256, solidityPack, toUtf8Bytes } from "ethers/lib/utils";
import { fetchFromApi, HttpMethod } from "lib/http";
import { Address } from "wallet/types/wallet";
import { MPCSigner } from "../zksync/signer";

/**
 * Prepares mpc Signer with Alchemy Provider
 * @param address
 * @param user
 * @returns
 */
const getPreparedMpcSigner = (address: Address, user: User): MPCSigner => {
  const provider = new ethers.providers.AlchemyProvider(config.chain, alchemyProviderKey);
  return new MPCSigner(address, user).connect(provider);
};

/**
 * Runs an gasless permit call on the token's contract
 * @param address
 * @param user
 * @param value
 * @param token erc20 token
 * @returns
 */
//TODO dynamic check if token has permit function
export const gasslessPermitWithApi = async (address: Address, user: User, value: string, token: ERC20Token) => {
  const mpcSigner = getPreparedMpcSigner(address, user);

  //token contract connected with our mpcSigner
  const tokenContractMpcSigner = new ethers.Contract(token.contractAddress, ERC20ABI, mpcSigner);

  //fetch apis tank address
  const tankAddress = await fetchFromApi<TankAddressResponse>("/gasless/tankAddress");

  // Create the approval request - api address will be permitted on token contract
  const approve = {
    owner: address.address,
    spender: tankAddress.address,
    value: ethers.utils.parseUnits(value, token.decimals),
  };

  // deadline as much as you want in the future
  const deadline = 100000000000000;

  // Get the user's nonce from the tokens contract address
  const nonce = await tokenContractMpcSigner.nonces(address.address);

  // Get the EIP712 digest
  const digest = getPermitDigest(
    await tokenContractMpcSigner.name(),
    tokenContractMpcSigner.address,
    config.chainId,
    approve,
    nonce,
    deadline
  );

  //Use signHashedMessage as the digest is already hashed
  const { v, r, s } = await mpcSigner.signHashedMessage(digest);

  // Let api approve it
  const { transaction } = await fetchFromApi<GaslessTransactionResponse>("/gasless/relayPermit", {
    method: HttpMethod.POST,
    body: {
      contractAddress: token.contractAddress,
      owner: approve.owner,
      spender: approve.spender,
      value: approve.value.toString(),
      deadline,
      v,
      r,
      s,
    },
  });

  return transaction;
};

/**
 * Transfers erc20 Token value from -> to (permit has to be called beforehand)
 * @param from
 * @param to
 * @param value
 * @param token
 * @returns
 */
export const gaslessTransferWithApi = async (from: Address, to: string, value: string, token: ERC20Token) => {
  // Let api approve it
  const { transaction } = await fetchFromApi<GaslessTransactionResponse>("/gasless/relayTransfer", {
    method: HttpMethod.POST,
    body: {
      contractAddress: token.contractAddress,
      from: from.address,
      to,
      value: ethers.utils.parseUnits(value, token.decimals).toString(),
    },
  });

  return transaction;
};

/**
 * Transfers erc20 Token value from -> to (no permit has to be called beforehand)
 * @param from
 * @param user
 * @param to
 * @param value
 * @param token
 * @returns
 */
export const gaslessTransferWithAuthorizationWithApi = async (
  from: Address,
  user: User,
  to: string,
  value: string,
  token: ERC20Token
) => {
  const mpcSigner = getPreparedMpcSigner(from, user);

  //token contract connected with our mpcSigner
  const tokenContractMpcSigner = new ethers.Contract(token.contractAddress, ERC20ABI, mpcSigner);

  // Create the approval request
  const approve = {
    from: from.address,
    to: to,
    value: ethers.utils.parseUnits(value, token.decimals),
  };

  // Create validation time
  const seconds = Math.round(new Date().getTime() / 1000);
  const validAfter = 0; //valid from now on
  const validBefore = seconds + 1200; // valid for 20min

  // Get the user's nonce
  const nonce = await tokenContractMpcSigner.nonces(from.address);

  // Get the EIP712 digest
  const digest = getTransferDigest(
    await tokenContractMpcSigner.name(),
    tokenContractMpcSigner.address,
    config.chainId,
    approve,
    toUtf8Bytes(ethers.utils.hexZeroPad(ethers.utils.hexlify(nonce), 32).slice(34)),
    validAfter,
    validBefore
  );

  const { v, r, s } = await mpcSigner.signHashedMessage(digest);

  //call api to relay transfer
  const { transaction } = await fetchFromApi<GaslessTransactionResponse>("/gasless/relayTransferWithAuthorization", {
    method: HttpMethod.POST,
    body: {
      contractAddress: token.contractAddress,
      from: approve.from,
      to: approve.to,
      value: approve.value.toString(),
      validAfter,
      validBefore,
      nonce: nonce.toString(),
      v,
      r,
      s,
    },
  });

  return transaction;
};

//Meta transaction utils after this ---

const getDomainSeparator = (name: string, contractAddress: string, chainId: number) => {
  return keccak256(
    defaultAbiCoder.encode(
      ["bytes32", "bytes32", "bytes32", "uint256", "address"],
      [
        keccak256(toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")),
        keccak256(toUtf8Bytes(name)),
        keccak256(toUtf8Bytes("2")),
        chainId,
        contractAddress,
      ]
    )
  );
};

const getPermitDigest = (
  name: string,
  address: string,
  chainId: number,
  approve: {
    owner: string;
    spender: string;
    value: BigNumberish;
  },
  nonce: BigNumberish,
  deadline: BigNumberish
) => {
  const DOMAIN_SEPARATOR = getDomainSeparator(name, address, chainId);
  return keccak256(
    solidityPack(
      ["bytes1", "bytes1", "bytes32", "bytes32"],
      [
        "0x19",
        "0x01",
        DOMAIN_SEPARATOR,
        keccak256(
          defaultAbiCoder.encode(
            ["bytes32", "address", "address", "uint256", "uint256", "uint256"],
            [PERMIT_TYPEHASH, approve.owner, approve.spender, approve.value, nonce, deadline]
          )
        ),
      ]
    )
  );
};

const PERMIT_TYPEHASH = keccak256(
  toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)")
);

const getTransferDigest = (
  name: string,
  address: string,
  chainId: number,
  approve: {
    from: string;
    to: string;
    value: BigNumberish;
  },
  nonce: BigNumberish,
  validAfter: BigNumberish,
  validBefore: BigNumberish
) => {
  const DOMAIN_SEPARATOR = getDomainSeparator(name, address, chainId);
  return keccak256(
    solidityPack(
      ["bytes1", "bytes1", "bytes32", "bytes32"],
      [
        "0x19",
        "0x01",
        DOMAIN_SEPARATOR,
        keccak256(
          defaultAbiCoder.encode(
            ["bytes32", "address", "address", "uint256", "uint256", "uint256", "bytes32"],
            [
              TRANSFER_WITH_AUTHORIZATION_TYPEHASH,
              approve.from,
              approve.to,
              approve.value,
              validAfter,
              validBefore,
              nonce,
            ]
          )
        ),
      ]
    )
  );
};

const TRANSFER_WITH_AUTHORIZATION_TYPEHASH = keccak256(
  toUtf8Bytes(
    "TransferWithAuthorization(address from,address to,uint256 value,uint256 validAfter,uint256 validBefore,bytes32 nonce)"
  )
);
