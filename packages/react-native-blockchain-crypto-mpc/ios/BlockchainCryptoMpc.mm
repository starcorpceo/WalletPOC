#import "BlockchainCryptoMpc.h"

#pragma mark - BlockchainCryptoMpc

@implementation BlockchainCryptoMpc

RCT_EXPORT_MODULE()

MPCCryptoContext *context;
MPCCryptoShare *share = nullptr;
MPCCryptoMessage *message = nullptr;

unsigned flags = 0;

bool finished = false;

RCT_REMAP_METHOD(initGenerateEcdsaKey,
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;
    
    if((rv = MPCCrypto_initGenerateEcdsaKey(1, &context))) {
        resolve(@(&"Failure " [ rv ]));
    }

    std::vector<uint8_t> message_buf;

    nativeStep(message_buf, finished);
        
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

RCT_REMAP_METHOD(step,
                 withMessageIn:(nonnull NSArray*)messageIn
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    std::vector<uint8_t> message_buf;
    
    unsigned long size = [messageIn count];

    for(int i = 0; i < size; i++) {
        message_buf.push_back([messageIn[i] intValue]);
    }

    nativeStep(message_buf, finished);

    unsigned long cMessageLen = message_buf.size();
    
    NSMutableArray * reactArray = [[NSMutableArray alloc] initWithCapacity: cMessageLen];

    for(int i = 0; i< cMessageLen; i++) {
        reactArray[i] = [NSNumber numberWithInt:message_buf[i]];
    }
    
    resolve(reactArray);
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
  if (rv = MPCCrypto_shareToBuf(share, buf.data(), &size))
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
  if (rv = MPCCrypto_messageToBuf(message, buf.data(), &size))
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
  if (rv = MPCCrypto_contextToBuf(context, buf.data(), &size))
    return rv;
  return 0;
}

static int context_from_buf(const std::vector<uint8_t> &mem, MPCCryptoContext *&context)
{
  return MPCCrypto_contextFromBuf(mem.data(), (int)mem.size(), &context);
}


@end
