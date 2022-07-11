import { Context, utils } from "@crypto-mpc";
import { other } from "@lib/error";
import { route } from "@lib/route";
import crypto from "crypto";
import Elliptic from "elliptic";
import { FastifyRequest } from "fastify";
import { ResultAsync } from "neverthrow";

const testMcp = route<string>((req: FastifyRequest) => {
  testCrypto();

  return ResultAsync.fromPromise(
    new Promise((resolve) => resolve("success")),
    (err) => other("waa", err as Error)
  );
});

function derive(s1: any, s2: any, harden: any, index: any) {
  const c1 = Context.createDeriveBIP32Context(1, s1, harden, index);
  const c2 = Context.createDeriveBIP32Context(2, s2, harden, index);
  utils.run(c1, c2);
  return [c1.getNewShare(), c2.getNewShare(), c1.getPublicKey(), c1.getXpub()];
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Signature = require("elliptic/lib/elliptic/ec/signature");

const ec = new Elliptic.ec("secp256k1");

const testCrypto = () => {
  console.log("Generate seed");
  let c1 = Context.createGenerateGenericSecretContext(1, 256);
  let c2 = Context.createGenerateGenericSecretContext(2, 256);
  utils.run(c1, c2);
  const seed1 = c1.getNewShare();
  const seed2 = c2.getNewShare();

  console.log("Derive master");
  const [m1, m2] = derive(seed1, seed2, false, 0);

  // Key
  console.log("Derive m/44'");
  const [m1_1H, m2_1H, _, xpub] = derive(m1, m2, true, 44);
  console.log("Xpub:", xpub);

  console.log("Generate key");
  c1 = Context.createGenerateEcdsaKey(1);
  c2 = Context.createGenerateEcdsaKey(2);
  utils.run(c1, c2);
  const k1 = c1.getNewShare();
  const k2 = c2.getNewShare();
  const publicKey = c1.getPublicKey();
  console.log("public key hey", publicKey.toString("hex"));

  const key = ec.keyFromPublic(publicKey.slice(23));
  console.log(key);

  console.log("Sign");
  const data = Buffer.from("Hello world");
  const hash = crypto.createHash("SHA256").update(data).digest();
  c1 = Context.createEcdsaSignContext(1, k1, hash, false);
  c2 = Context.createEcdsaSignContext(2, k2, hash, false);
  utils.run(c1, c2);
  console.log("Signature 1:", c1.getSignature().toString("hex"));
  console.log("Signature 2:", c2.getSignature().toString("hex"));
  const signature = new Signature(c1.getSignature());
  console.log("Signature", key.verify(hash, signature));
};

export default testMcp;
