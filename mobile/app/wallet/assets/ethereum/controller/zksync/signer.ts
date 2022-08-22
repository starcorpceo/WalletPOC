import { Provider, TransactionRequest } from "@ethersproject/abstract-provider";
import { serialize, UnsignedTransaction } from "@ethersproject/transactions";
import { User } from "api-types/user";
import { Bytes, Signer } from "ethers";
import { defineReadOnly, getAddress, joinSignature, keccak256, resolveProperties, toUtf8Bytes } from "ethers/lib/utils";
import * as LocalAuthentication from "expo-local-authentication";
import { signEcdsa } from "lib/mpc";
import { getBinSignature } from "react-native-blockchain-crypto-mpc";
import { Address } from "wallet/types/wallet";
import { getSignatureWithRecoveryCode } from "../ethereum-utils";

export class MPCSigner extends Signer {
  private address: Address;
  private user: User;

  constructor(address: Address, user: User) {
    super();
    this.address = address;
    this.user = user;
  }

  getAddress(): Promise<string> {
    return Promise.resolve(this.address.address);
  }
  async signMessage(message: string | Bytes): Promise<string> {
    if (typeof message === "string") {
      message = toUtf8Bytes(message);
    }

    const context = await signEcdsa(
      this.user.devicePublicKey,
      this.user.id,
      this.address.keyShare.id,
      this.address.keyShare.keyShare,
      Buffer.from(message as Uint8Array).toString("utf8"),
      "utf8"
    );

    const { signature, recoveryCode: recoveryParam } = await getBinSignature(context, this.address.keyShare.keyShare);

    const sigBuff = Buffer.from(signature, "base64");

    const sig = {
      r: "0x" + sigBuff.slice(0, 32).toString("hex"),
      s: "0x" + sigBuff.slice(32, 64).toString("hex"),
      recoveryParam,
    };

    return joinSignature(sig);
  }

  async signTransaction(transaction: TransactionRequest): Promise<string> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to verify your Device WalletPOC",
      cancelLabel: "cancel",
    });

    if (!result.success) {
      // Show snackbar here or similar
      throw new Error(result.error);
    }
    return resolveProperties(transaction).then(async (tx) => {
      if (tx.from != null) {
        if (getAddress(tx.from) !== this.address.address) {
          console.error(
            "transaction from address mismatch",
            "transaction.from",
            tx.from,
            " !== ",
            this.address.address
          );
        }
        delete tx.from;
      }

      const serialized = serialize(<UnsignedTransaction>tx);
      const kec = keccak256(serialized).split("0x")[1];

      const context = await signEcdsa(
        this.user.devicePublicKey,
        this.user.id,
        this.address.keyShare.id,
        this.address.keyShare.keyShare,
        kec,
        "hex"
      );

      const { signature, recoveryCode } = await getBinSignature(context, this.address.keyShare.keyShare);

      const sigBuff = Buffer.from(signature, "base64");

      const sig = getSignatureWithRecoveryCode(
        {
          r: "0x" + sigBuff.slice(0, 32).toString("hex"),
          s: "0x" + sigBuff.slice(32, 64).toString("hex"),
          recoveryParam: 0,
        },
        Buffer.from(kec, "hex"),
        this.address.address
      );

      return serialize(<UnsignedTransaction>tx, sig);
    });
  }

  connect(provider: Provider): MPCSigner {
    defineReadOnly(this, "provider", provider || null);
    return this;
  }
}
