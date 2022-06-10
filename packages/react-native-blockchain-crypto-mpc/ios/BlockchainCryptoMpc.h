#ifndef BLOCKCHAINCRYPTOMPC_CODE
#define BLOCKCHAINCRYPTOMPC_CODE

#import <React/RCTBridgeModule.h>

#ifdef __cplusplus

#import "nativempc.h"
#import "mpc_crypto.h"
#include <vector>

#endif

@class BlockchainCryptoMpc;

@interface BlockchainCryptoMpc : NSObject <RCTBridgeModule>

@end

#endif
