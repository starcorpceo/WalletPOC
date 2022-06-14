/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
const Context = require("./lib/context");
const Message = require("./lib/message");
const Share = require("./lib/share");
const utils: Utils = require("./lib/utils");

export { Context, Share, Message, utils };

type Utils = {
  run: (c1: any, c2: any) => void;
  verifyEcdsaBackupKey: (
    backupPublicKey: any,
    publicKey: any,
    backup: any
  ) => any;
  restoreEcdsaKey: (backupPrivateKey: any, publicKey: any, backup: any) => any;
  verifyEddsaBackupKey: (
    backupPrivateKey: any,
    publicKey: any,
    backup: any
  ) => any;
  restoreEddsaKey: (backupPrivateKey: any, publicKey: any, backup: any) => any;
};
