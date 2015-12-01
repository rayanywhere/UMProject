#import <Foundation/Foundation.h>
#import "UMCore.h"

#define kUMWebResultSucc 0
#define kUMWebResultNetworkError -1
#define kUMWebResultServerError -2

@interface UMWebClient : NSObject
+ (void)getUserWithRequest:(UMCoreHttpGetUserRequest *)request withResponseCallback:(void (^)(UMCoreHttpGetUserResponse *response, NSInteger error))responseCallback;
+ (void)setUserWithRequest:(UMCoreHttpSetUserRequest *)request withResponseCallback:(void (^)(UMCoreHttpSetUserResponse *response, NSInteger error))responseCallback;

@end
