#import <Foundation/Foundation.h>

@interface UMCore : NSObject
- (instancetype)initWithJson:(NSDictionary *)json;
- (NSDictionary *)encodeToJson;
@end


@class UMCoreBasicUser;
@class UMCoreHttpGetUserRequest;
@class UMCoreHttpGetUserResponse;
@class UMCoreHttpSetUserRequest;
@class UMCoreHttpSetUserResponse;


#pragma mark - Objects for namespace Basic

@interface UMCoreBasicUser : UMCore
@property (strong, nonatomic) NSString *name;
@property (assign, nonatomic) NSInteger age;
@end


#pragma mark - Objects for namespace Http

@interface UMCoreHttpGetUserRequest : UMCore
@end

@interface UMCoreHttpGetUserResponse : UMCore
@property (strong, nonatomic) UMCoreBasicUser *user;
@end

@interface UMCoreHttpSetUserRequest : UMCore
@property (strong, nonatomic) UMCoreBasicUser *user;
@end

@interface UMCoreHttpSetUserResponse : UMCore
@end

