import { other } from "@lib/error";
import { route } from "@lib/route";
import { FastifyRequest } from "fastify";
import { ResultAsync } from "neverthrow";

import { Share } from "@crypto-mpc";
import { db } from "@lib/dev-db";
import { ec } from "elliptic";

export const verifyEcdsaSignature = route<boolean>((req: FastifyRequest) => {
  //TODO: Type
  const { hash, signature } = JSON.parse(req.body as string);
  const curve = new ec("secp256k1");

  // TODO: remove this in favor of real db. Will be async in nature and therefore need a ResultAsync
  const share = Share.fromBuffer(db.shareBuf);

  const publicKey = share.getEcdsaPublic().slice(23);

  const key = curve.keyFromPublic(publicKey);

  return ResultAsync.fromPromise(
    new Promise((resolve) =>
      resolve(key.verify(Buffer.from(hash), Buffer.from(signature)))
    ),
    (err) => other("Failed to verify", err as Error)
  );
});
