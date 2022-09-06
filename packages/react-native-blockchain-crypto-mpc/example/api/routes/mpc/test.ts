import { Context, utils } from '@crypto-mpc';
import { other } from '@lib/error';
import logger from '@lib/logger';
import { route } from '@lib/route';
import { Buffer } from 'buffer';
import crypto from 'crypto';
import Elliptic from 'elliptic';
import { FastifyRequest } from 'fastify';
import { ResultAsync } from 'neverthrow';

const testMcp = route<string>((_req: FastifyRequest) => {
  testCrypto();

  return ResultAsync.fromPromise(new Promise((resolve) => resolve('success')), (err) => other('waa', err as Error));
});

function derive(s1: any, s2: any, harden: any, index: any) {
  const c1 = Context.createDeriveBIP32Context(1, s1, harden, index);
  const c2 = Context.createDeriveBIP32Context(2, s2, harden, index);
  utils.run(c1, c2);
  return [c1.getNewShare(), c2.getNewShare(), c1.getPublicKey(), c1.getXpub()];
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Signature = require('elliptic/lib/elliptic/ec/signature');

const ec = new Elliptic.ec('secp256k1');

const testCrypto = () => {
  logger.info('Generate seed');
  let c1 = Context.createGenerateGenericSecretContext(1, 256);
  let c2 = Context.createGenerateGenericSecretContext(2, 256);
  utils.run(c1, c2);
  const seed1 = c1.getNewShare();
  const seed2 = c2.getNewShare();

  logger.info('Derive master');
  const [m1, m2] = derive(seed1, seed2, false, 0);

  // Key
  logger.info("Derive m/44'");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [m1_1H, m2_1H, _, xpub] = derive(m1, m2, true, 44);
  logger.info('Xpub:', xpub);

  logger.info('Generate key');
  c1 = Context.createGenerateEcdsaKey(1);
  c2 = Context.createGenerateEcdsaKey(2);
  utils.run(c1, c2);
  const k1 = c1.getNewShare();
  const k2 = c2.getNewShare();
  const publicKey = c1.getPublicKey();
  logger.info('public key hey', publicKey.toString('hex'));

  const key = ec.keyFromPublic(publicKey.slice(23));

  logger.info('Sign');
  const data = Buffer.from('Hello world');
  const hash = crypto.createHash('SHA256').update(data).digest();
  c1 = Context.createEcdsaSignContext(1, k1, hash, false);
  c2 = Context.createEcdsaSignContext(2, k2, hash, false);
  utils.run(c1, c2);
  logger.info('Signature 1:', c1.getSignature().toString('hex'));
  logger.info('Signature 2:', c2.getSignature().toString('hex'));
  const signature = new Signature(c1.getSignature());
  logger.info({ sig: key.verify(hash, signature) }, 'Signature');
};

export default testMcp;
