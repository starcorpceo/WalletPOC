interface DevDB {
  shareBuf: Buffer | undefined;
  signature: Buffer | undefined;
}

export const db: DevDB = {
  shareBuf: undefined,
  signature: undefined,
};
