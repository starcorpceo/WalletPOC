#import "BlockchainCryptoMpc.h"

#pragma mark - BlockchainCryptoMpc

@implementation BlockchainCryptoMpc

RCT_EXPORT_MODULE()

MPCCryptoContext *context;
MPCCryptoShare *share = nullptr;

unsigned flags = 0;

bool finished = false;

RCT_EXPORT_METHOD(initGenerateGenericSecret:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;

    if ((rv = MPCCrypto_initGenerateGenericSecret(1, 256, &context))){
        resolve(@(&"Failure " [ rv ]));
    }
    
    if(rv == 0)
        resolve(@true);
    else
        resolve(@false);
}

RCT_EXPORT_METHOD(importGenericSecret:(NSArray*)secret
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;

    std::vector<uint8_t> secret_buf;

    unsigned long size = [secret count];
    char secretChars[size];
    react_array_to_char_array(secret, size, secretChars);

    //std::vector<uint8_t> seed_key = hex2bin(secret);
    if ((rv = MPCCrypto_initImportGenericSecret(1, (const uint8_t *)secretChars, (int)size, &context)))
        resolve(@(&"Failure " [ rv ]));

    if(rv == 0)
        resolve(@true);
    else
        resolve(@false);
}

RCT_EXPORT_METHOD(initDeriveBIP32:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;

    MPCCrypto_freeContext(context);
    context = nullptr;

    if ((rv = MPCCrypto_initDeriveBIP32(1, share, 0, 0, &context)))
      resolve(@(&"Failure " [ rv ]));

    if(rv == 0)
        resolve(@true);
    else
        resolve(@false);
}


RCT_EXPORT_METHOD(getShare:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;
    
    std::vector<uint8_t> share_buf;
    if ((rv = share_to_buf(share, share_buf)))
        resolve(@(&"Failure " [ rv ]));
    
    unsigned long cPubLen = share_buf.size();

    NSMutableArray * nsShareBuf = [[NSMutableArray alloc] initWithCapacity: cPubLen];

    for(int i = 0; i< cPubLen; i++) {
        nsShareBuf[i] = [NSNumber numberWithInt:share_buf[i]];
    }

    resolve(nsShareBuf);
}

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

RCT_EXPORT_METHOD(step:(NSString*)messageIn
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    
    std::vector<uint8_t> message_buf;

    if(messageIn != nil) {
        NSData *nsdataFromBase64String = [[NSData alloc]
                                          initWithBase64EncodedString:messageIn options:0];

        unsigned long size = nsdataFromBase64String.length;

        char* buffer = (char* )malloc(size);

        [nsdataFromBase64String getBytes:buffer range:NSMakeRange(0, size)];

                
        for(int i = 0; i < size; i++) {
            message_buf.push_back(buffer[i]);
        }
        
    }
    
    
    int rv = nativeStep(message_buf, finished);

    unsigned long cMessageLen = message_buf.size();
    
    NSMutableArray * reactArray = [[NSMutableArray alloc] initWithCapacity: cMessageLen];

    for(int i = 0; i< cMessageLen; i++) {
        reactArray[i] = [NSNumber numberWithInt:message_buf[i]];
    }
    
    NSData *outData = [NSData dataWithBytes:message_buf.data() length:message_buf.size()];

    NSString *outString = [outData base64EncodedStringWithOptions:0];
    
    if(rv == 0) {
        resolve(outString);
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

static std::vector<uint8_t> hex2bin(const std::string &src)
{
  int dst_size = (int)src.length() / 2;
  std::vector<uint8_t> dst(dst_size);
  for (int i = 0; i < dst_size; i++)
    dst[i] = hex2int(src[i * 2]) * 16 + hex2int(src[i * 2 + 1]);
  return dst;
}

static int hex2int(char input)
{
  if (input >= '0' && input <= '9')
    return input - '0';
  if (input >= 'A' && input <= 'F')
    return input - 'A' + 10;
  if (input >= 'a' && input <= 'f')
    return input - 'a' + 10;
  return -1;
}


@end
