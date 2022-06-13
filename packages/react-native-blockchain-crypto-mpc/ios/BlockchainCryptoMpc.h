#ifndef BLOCKCHAINCRYPTOMPC_CODE
#define BLOCKCHAINCRYPTOMPC_CODE

#import <React/RCTBridgeModule.h>

#ifdef __cplusplus

#include "nativempc.h"
#include "mpc_crypto_test.h"
#include <vector>

#endif

@class BlockchainCryptoMpc;

@interface BlockchainCryptoMpc : NSObject <RCTBridgeModule>

@end

#endif
