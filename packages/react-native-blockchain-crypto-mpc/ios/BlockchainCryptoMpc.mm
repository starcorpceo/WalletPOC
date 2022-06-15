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
    
    if((rv = MPCCrypto_initGenerateEcdsaKey(1, &context))) {
        resolve(@(&"Failure " [ rv ]));
    }

    unsigned flags = 0;

    MPCCryptoMessage *message = nullptr;
    if((rv = MPCCrypto_step(context, nullptr, &message, &flags))){
        resolve(@(&"Failure " [ rv ]));
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
    
    char messageString[size+1];
    
    memcpy(messageString, message_buf.data(), size);
    
    //NSString *messageString = ([NSString stringWithFormat:@"%@", message]);
    //std::string foo = std::string([messageString UTF8String]);
    
    NSString *aasdf = [NSString stringWithCString:messageString encoding:NSASCIIStringEncoding];

    
    if(rv == 0) {
        resolve(@{@"res": aasdf});
    } else {
        resolve(@(&"Failure " [ rv ]));
    }

}

@end
