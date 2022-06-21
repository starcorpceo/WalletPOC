#import "BlockchainCryptoMpc.h"

#pragma mark - BlockchainCryptoMpc

@implementation BlockchainCryptoMpc

RCT_EXPORT_MODULE()

MPCCryptoContext *context;
MPCCryptoShare *share = nullptr;

unsigned flags = 0;

bool finished = false;

RCT_EXPORT_METHOD(initGenerateEcdsaKey:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;
    
    if((rv = MPCCrypto_initGenerateEcdsaKey(1, &context))) {
        resolve(@(&"Failure " [ rv ]));
    }

    
    if(rv == 0)
        resolve(@true);
    else
        resolve(@false);
}

RCT_EXPORT_METHOD(initSignEcdsa:(NSArray*)message withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;

    std::vector<uint8_t> message_buf;

    unsigned long size = [message count];
    char messageChars[size];
    react_array_to_char_array(message, size, messageChars);

    finished = false;
    

    if((rv = MPCCrypto_initEcdsaSign(1, share, (const uint8_t *)messageChars, (int)size, 1, &context))) {
        resolve(@(&"Failure " [ rv ]));
    }

    if(rv == 0)
        resolve(@true);
    else
        resolve(@false);
}


RCT_EXPORT_METHOD(getSignature:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
      int rv = 0;

    if(finished) {
        
        int sig_size = 0;
        if ((rv = MPCCrypto_getResultEcdsaSign(context, nullptr, &sig_size)))
            resolve(@(&"Failure " [ rv ]));
        std::vector<uint8_t> sig(sig_size);
        if ((rv = MPCCrypto_getResultEcdsaSign(context, sig.data(), &sig_size)))
            resolve(@(&"Failure " [ rv ]));
        
        unsigned long sigLen = sig.size();
        
        NSMutableArray * sigArr = [[NSMutableArray alloc] initWithCapacity: sigLen];
        
        for(int i = 0; i< sigLen; i++)
            sigArr[i] = [NSNumber numberWithInt:sig[i]];
        
        
        resolve(sigArr);
        return;
    }

    resolve(@"Not finished");
}


RCT_EXPORT_METHOD(verifySignature:(nonnull NSArray*)message withSignature:(nonnull NSArray*) signature withResolver: (RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;
    
    if(!finished) {
        resolve(@"Not finished");
        return;
    }
    
    unsigned long msgSize = [message count];
    char messageChars[msgSize];
    react_array_to_char_array(message, msgSize, messageChars);
        
    unsigned long sigSize = [signature count];
    char signatureChars[sigSize];
    react_array_to_char_array(signature, sigSize, signatureChars);
    
    int pub_key_size = 0;
    if ((rv = MPCCrypto_getEcdsaPublic(share, nullptr, &pub_key_size)))
        resolve(@(&"Failure " [ rv ]));
    std::vector<uint8_t> pub_ec_key(pub_key_size);
    if ((rv = MPCCrypto_getEcdsaPublic(share, pub_ec_key.data(), &pub_key_size)))
        resolve(@(&"Failure " [ rv ]));
    
    if ((rv = MPCCrypto_verifyEcdsa(pub_ec_key.data(), (int)pub_ec_key.size(), (const uint8_t *)messageChars, (int)msgSize, (const uint8_t *)signatureChars, (int)sigSize))){
        resolve(@false);
        return;
    }

    
    resolve(@true);
}



RCT_EXPORT_METHOD(getPublicKey:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
      int rv = 0;

   if(finished) {
      int pub_key_size = 0;

      if ((rv = MPCCrypto_getEcdsaPublic(share, nullptr, &pub_key_size)))
          resolve(@(&"Failure " [ rv ]));
      std::vector<uint8_t> pub_ec_key(pub_key_size);
        
      if ((rv = MPCCrypto_getEcdsaPublic(share, pub_ec_key.data(), &pub_key_size)))
          resolve(@(&"Failure " [ rv ]));

      unsigned long cPubLen = pub_ec_key.size();

        NSMutableArray * pubKeyArr = [[NSMutableArray alloc] initWithCapacity: cPubLen];

      for(int i = 0; i< cPubLen; i++) {
          pubKeyArr[i] = [NSNumber numberWithInt:pub_ec_key[i]];
      } 
    
       resolve(pubKeyArr);
       return;
    }

    resolve(@"Not finished");
}

RCT_EXPORT_METHOD(step:(NSArray*)messageIn
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    std::vector<uint8_t> message_buf;

    unsigned long size = [messageIn count];

    for(int i = 0; i < size; i++) {
        message_buf.push_back([messageIn[i] intValue]);
    }

    int rv = nativeStep(message_buf, finished);

    unsigned long cMessageLen = message_buf.size();
    
    NSMutableArray * reactArray = [[NSMutableArray alloc] initWithCapacity: cMessageLen];

    for(int i = 0; i< cMessageLen; i++) {
        reactArray[i] = [NSNumber numberWithInt:message_buf[i]];
    }

    if(rv == 0) {
        resolve(reactArray);
    } else {
        resolve(@(&"Failure " [ rv ]));
    }
}

static void react_array_to_char_array(NSArray * reactArray, unsigned long size, char* messageChars) {        
    for(int i = 0; i < size; i++) {
        uint8_t value = (uint8_t)[reactArray[i] unsignedIntValue];
        messageChars[i] = value;
    }
}

static int nativeStep(std::vector<uint8_t> &message_buf, bool &finished)
{
  int rv = 0;

  MPCCryptoMessage *in = nullptr;
  MPCCryptoMessage *out = nullptr;

  if (!message_buf.empty())
  {
      if ((rv = message_from_buf(message_buf, in)))
      return rv;
  }

  unsigned flags = 0;
  if ((rv = MPCCrypto_step(context, in, &out, &flags)))
    return rv;
    
  if (in)
    MPCCrypto_freeMessage(in);

  std::vector<uint8_t> context_buf;
    if ((rv = context_to_buf(context, context_buf)))
        return rv;
    
  MPCCrypto_freeContext(context);
  context = nullptr;
  if ((rv = context_from_buf(context_buf, context)))
    return rv;

  finished = (flags & mpc_protocol_finished) != 0;

  if (flags & mpc_share_changed)
  {
    MPCCrypto_freeShare(share);
      share = nullptr;
    if ((rv = MPCCrypto_getShare(context, &share)))
      return rv;
    std::vector<uint8_t> share_buf;
    if ((rv = share_to_buf(share, share_buf)))
      return rv;
    MPCCrypto_freeShare(share);
      share = nullptr;
    if ((rv = share_from_buf(share_buf, share)))
      return rv;
  }

  if (out)
  {
    if ((rv = message_to_buf(out, message_buf)))
      return rv;
    MPCCrypto_freeMessage(out);
  }
  else
    message_buf.clear();

  return rv;
}


static int share_to_buf(MPCCryptoShare *share, std::vector<uint8_t> &buf)
{
  int rv = 0;
  int size = 0;
  if ((rv = MPCCrypto_shareToBuf(share, nullptr, &size)))
    return rv;
  buf.resize(size);
  if ((rv = MPCCrypto_shareToBuf(share, buf.data(), &size)))
    return rv;
  return 0;
}

static int share_from_buf(const std::vector<uint8_t> &mem, MPCCryptoShare *&share)
{
  return MPCCrypto_shareFromBuf(mem.data(), (int)mem.size(), &share);
}

static int message_to_buf(MPCCryptoMessage *message, std::vector<uint8_t> &buf)
{
  int rv = 0;
  int size = 0;
  if ((rv = MPCCrypto_messageToBuf(message, nullptr, &size)))
    return rv;
  buf.resize(size);
  if ((rv = MPCCrypto_messageToBuf(message, buf.data(), &size)))
    return rv;
  return 0;
}

static int message_from_buf(const std::vector<uint8_t> &mem, MPCCryptoMessage *&message)
{
  return MPCCrypto_messageFromBuf(mem.data(), (int)mem.size(), &message);
}

static int context_to_buf(MPCCryptoContext *context, std::vector<uint8_t> &buf)
{
  int rv = 0;
  int size = 0;
  if ((rv = MPCCrypto_contextToBuf(context, nullptr, &size)))
    return rv;
  buf.resize(size);
  if ((rv = MPCCrypto_contextToBuf(context, buf.data(), &size)))
    return rv;
  return 0;
}

static int context_from_buf(const std::vector<uint8_t> &mem, MPCCryptoContext *&context)
{
  return MPCCrypto_contextFromBuf(mem.data(), (int)mem.size(), &context);
}


@end
