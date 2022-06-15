#import "BlockchainCryptoMpc.h"

#pragma mark - BlockchainCryptoMpc

@implementation BlockchainCryptoMpc

RCT_EXPORT_MODULE()

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_REMAP_METHOD(initGenerateEcdsaKey,
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;
    
    MPCCryptoContext *context;
    MPCCryptoShare *share = nullptr;
    
    if((rv = MPCCrypto_initGenerateEcdsaKey(1, &context))) {
        resolve(@(&"Failure " [ rv ]));
    }

    unsigned flags = 0;

    MPCCryptoMessage *message = nullptr;
    
    if((rv = MPCCrypto_step(context, nullptr, &message, &flags))){
        resolve(@(&"Failure " [ rv ]));
    }
    
    if((flags & mpc_share_changed)){
        
        MPCCrypto_freeShare(share);
        share = nullptr;
        if ((rv = MPCCrypto_getShare(context, &share))){
            resolve(@(&"Failure " [ rv ]));
        }
        std::vector<uint8_t> share_buf;
        
        //instead of share_to_buf() from tests
        int size = 0;
        if ((rv = MPCCrypto_shareToBuf(share, nullptr, &size))){
            resolve(@(&"Failure " [ rv ]));
        }
        share_buf.resize(size);
        if ((rv = MPCCrypto_shareToBuf(share, share_buf.data(), &size))){
            resolve(@(&"Failure " [ rv ]));
        }
        
        MPCCrypto_freeShare(share);
        
        share = nullptr;
        if ((rv = MPCCrypto_shareFromBuf(share_buf.data(), (int)share_buf.size(), &share))){
            resolve(@(&"Failure " [ rv ]));
        }
    }
    
    int size = 0;
    std::vector<uint8_t> message_buf;
    if((rv = MPCCrypto_messageToBuf(message, nullptr, &size))) {
        resolve(@(&"Failure " [ rv ]));
    }
    message_buf.resize(size);
    if((rv = MPCCrypto_messageToBuf(message, message_buf.data(), &size))){
        resolve(@(&"Failure " [ rv ]));
    }
    
     
    
    char bufferString[size+1];
    memcpy(bufferString, message_buf.data(), size);
    bufferString[size] = '\0';
        
    NSString *bufferNSString = [NSString stringWithCString:bufferString encoding:[NSString defaultCStringEncoding]];

        
    if(rv == 0) {
        resolve(bufferNSString);
    } else {
        resolve(@(&"Failure " [ rv ]));
    }

}


@end
