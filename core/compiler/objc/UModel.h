#import <Foundation/Foundation.h>

@interface UModel : NSObject
- (instancetype)initWithJson:(NSDictionary *)json;
- (NSDictionary *)encodeToJson;
@end
const NSInteger kUMCommonUserInfoGenderMale = 0;
const NSInteger kUMCommonUserInfoGenderFemale = 1;


@class UMCommonUserInfo;
@class UMCommonUserBusinesscard;
@class UMCommonUserAddress;
@class UMNetworkUserInfoRequest;
@class UMNetworkUserInfoResponse;


#pragma mark - Objects for namespace Common

@interface UMCommonUserInfo : UModel
@property (strong, nonatomic) NSString *name;
@property (assign, nonatomic) NSInteger gender;
@property (strong, nonatomic) UMCommonUserBusinesscard *businesscard;
@property (strong, nonatomic) UMCommonUserAddress *addresses;
@end

@interface UMCommonUserBusinesscard : UModel
@property (strong, nonatomic) NSString *title;
@property (strong, nonatomic) NSString *department;
@end

@interface UMCommonUserAddress : UModel
@property (assign, nonatomic) double latitude;
@property (assign, nonatomic) double longitude;
@property (strong, nonatomic) NSString *location;
@end


#pragma mark - Objects for namespace Network

@interface UMNetworkUserInfoRequest : UModel
@property (strong, nonatomic) NSString *uid;
@property (strong, nonatomic) NSString *auth;
@end

@interface UMNetworkUserInfoResponse : UModel
@property (strong, nonatomic) UMCommonUserInfo *info;
@end

