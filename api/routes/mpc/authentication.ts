import { buildPubKey } from "@lib/auth";
import { isNonceValid } from "@lib/nonce";
import crypto from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { getUser } from "../user/user.repository";

export const authenticate = async (req: FastifyRequest, res: FastifyReply) => {
  const { devicesignature, devicepublickey, userid } = req.headers;

  const signedNonce = req.cookies["authnonce"];
  const nonce = req.unsignCookie(signedNonce).value;

  if (
    !isMpcRequestValid(
      devicesignature as string,
      devicepublickey as string,
      userid as string,
      nonce
    )
  ) {
    console.log((userid as string).length);

    throw new Error("Invalid Request to Mpc Endpoint");
  }

  const user = await getUser({
    userId: userid as string,
    devicePublicKey: devicepublickey as string,
  });

  const verifier = crypto
    .createVerify("SHA256")
    .update(nonce as string, "utf-8");

  const result = verifier.verify(
    {
      key: buildPubKey(user.devicePublicKey),
      format: "pem",
      type: "pkcs1",
    },
    Buffer.from(devicesignature as string, "base64")
  );

  if (!result) {
    throw new Error("Invalid Signature");
  }
};

const isMpcRequestValid = (
  deviceSignature: string,
  devicePublicKey: string,
  userid: string,
  nonce: string | null
) => {
  return (
    isNonceValid(nonce) &&
    isDeviceSignatureValid(deviceSignature) &&
    isDevicePublicKeyValid(devicePublicKey) &&
    isUserIdValid(userid)
  );
};

const isDeviceSignatureValid = (deviceSignature: string | null) =>
  deviceSignature && deviceSignature.length === 96;

const isDevicePublicKeyValid = (devicePublicKey: string | null) =>
  devicePublicKey && devicePublicKey.length === 124;

const isUserIdValid = (userId: string | null) => userId && userId.length === 36;
