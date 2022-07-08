export const buildPubKey = (encoded: string) => {
  // Beginning public key execution
  const l1 = "-----BEGIN PUBLIC KEY-----\n";

  // Finishing public key execution
  const l3 = "\n-----END PUBLIC KEY-----";

  // concatenating all public keys
  return l1 + encoded + l3;
};
