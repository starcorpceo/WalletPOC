import { User } from "api-types/user";
import { BigNumberish, ethers, Wallet } from "ethers";
import { defaultAbiCoder, toUtf8Bytes, keccak256, solidityPack } from "ethers/lib/utils";
import { Address } from "wallet/types/wallet";
import { MPCSigner } from "../zksync/signer";
import { abi as ERC20ABI } from "@uniswap/v2-core/build/ERC20.json";

export const gaslessPermit = async (address: Address, user: User) => {
  //create our mpc signer
  const provider = new ethers.providers.AlchemyProvider(
    "goerli", // or 'ropsten', 'rinkeby', 'kovan', 'goerli'
    "ahl42ynne2Kd8FosnoYBtCW3ssoCtIu0"
  );
  const mpcSigner = await new MPCSigner(address, user).connect(provider);

  //token contract connected with our mpcSigner
  const usdcTokenContractMpcSigner = new ethers.Contract(
    "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
    ERC20ABI,
    mpcSigner
  );

  //second wallet which will pay our gas fees
  const signerSpender = new Wallet("159484bb7cae6c10194f80f4d4038ac5450421aab6a2b281bac20f1546c57902", provider);

  //token contract connected with spenders signer
  const usdcTokenContractSpender = new ethers.Contract(
    "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
    ERC20ABI,
    signerSpender
  );

  // Create the approval request
  const approve = {
    owner: address.address,
    spender: signerSpender.address,
    value: 100,
  };

  // deadline as much as you want in the future
  const deadline = 100000000000000;

  // Get the user's nonce
  const nonce = await usdcTokenContractMpcSigner.nonces(address.address);

  // Get the EIP712 digest
  const digest = getPermitDigest(
    await usdcTokenContractMpcSigner.name(),
    usdcTokenContractMpcSigner.address,
    5,
    approve,
    nonce,
    deadline
  );

  //const { v, r, s } = sign(digest, Buffer.from(signer.privateKey.slice(2), "hex"));
  const { v, r, s } = await mpcSigner.signHashedMessage(digest);

  console.log("PERMIT: ", (await usdcTokenContractMpcSigner.PERMIT_TYPEHASH()) == PERMIT_TYPEHASH);
  console.log(
    "DOMAIN: ",
    (await usdcTokenContractMpcSigner.DOMAIN_SEPARATOR()) ==
      getDomainSeparator(await usdcTokenContractMpcSigner.name(), "0x07865c6e87b9f70255377e024ace6630c1eaa37f", 5)
  );

  console.log("Our address: ", address.address);
  console.log("Payers address: ", signerSpender.address);

  // Approve it
  const transaction = await usdcTokenContractSpender.permit(
    approve.owner,
    approve.spender,
    approve.value,
    deadline,
    v,
    r,
    s
  );
  console.log("Transaction: ", transaction);

  await transaction.wait();
  console.log("Permit confirmed");
  return transaction;
};

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
