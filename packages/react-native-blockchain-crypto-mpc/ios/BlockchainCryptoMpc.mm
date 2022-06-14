#import "BlockchainCryptoMpc.h"

#pragma mark - BlockchainCryptoMpc

@implementation BlockchainCryptoMpc

RCT_EXPORT_MODULE()

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_REMAP_METHOD(multiply,
                 multiplyWithA:(nonnull NSNumber*)a withB:(nonnull NSNumber*)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    int returnVal = MPCCrypto_test();
    


    if(returnVal == 0) {
        resolve(@("test successfull"));
    } else {
        resolve(@(&"Failure " [ returnVal]));
    }

}

@end
