#import "UModel.h"

@implementation UModel
- (instancetype)initWithJson:(NSString *)json {
	return [super init];
}

- (NSString *)encodeToJson {
	return @"";
}
@end



@implementation UMCommonUserInfo
- (instancetype)init {
	if (self = [super init]) {
		_name = @"";
		_gender = kUMCommonUserInfoGenderFemale;
		_businesscard = [UMCommonUserBusinesscard new];
		_addresses = [NSArray<UMCommonUserAddress *> array];
		
	}
	return self;
}

- (instancetype)initWithJson:(NSDictionary *)json {
	if (self = [self init]) {
		id attribute = nil;

		attribute = [json objectForKey:@"name"];
		if (attribute) {
			_name = attribute;
			
		}
		else {
			_name = @"";
			}
	attribute = [json objectForKey:@"gender"];
		if (attribute) {
			_gender = ((NSNumber *)attribute).integerValue;
			
		}
		else {
			_gender = kUMCommonUserInfoGenderFemale;
			}
	attribute = [json objectForKey:@"businesscard"];
		if (attribute) {
			_businesscard = [[UMCommonUserBusinesscard alloc] initWithJson:attribute];
			
		}
		else {
			_businesscard = [UMCommonUserBusinesscard new];
			}
	attribute = [json objectForKey:@"addresses"];
		if (attribute) {
			NSMutableArray<UMCommonUserAddress *> *array = [NSMutableArray<UMCommonUserAddress *> array];
			for(NSDictionary *item in attribute) {
				[array addObject:[[UMCommonUserAddress alloc] initWithJson:item]];
			}
			_addresses = array;
			
		}
		else {
			_addresses = [NSArray<UMCommonUserAddress *> array];
			}
	
	}
	return self;
}

- (NSDictionary *)encodeToJson {
	NSMutableDictionary *json = [NSMutableDictionary dictionary];

	[json setObject:_name forKey:@"name"];
	[json setObject:@(_gender) forKey:@"gender"];
	[json setObject:[_businesscard encodeToJson] forKey:@"businesscard"];
	{
		NSMutableArray *array = [NSMutableArray array];
		for(UMCommonUserAddress *item in _addresses) {
			[array addObject:[item encodeToJson]];
		}
		[json setObject:array forKey:@"addresses"];
	}
	
	return json;
}


- (void)setName:(NSString *)name {
	NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"\w{1,10}" options:0 error:nil];
	if (![regex numberOfMatchesInString:name options:0 range:NSMakeRange(0, name.length)]) {
		[NSException raise:@"UModel" format:@"mismatch regex"];
		return;
	}
	
	_name = name;
}

- (void)setGender:(NSInteger )gender {
	if ((gender < 0)
		|| (gender >= 1)) {
		[NSException raise:@"UModel" format:@"out of range"];
		return;
	}
	
	_gender = gender;
}

- (void)setBusinesscard:(UMCommonUserBusinesscard *)businesscard {
	
	_businesscard = businesscard;
}

- (void)setAddresses:(UMCommonUserAddress *)addresses {
	
	_addresses = addresses;
}

@end


@implementation UMCommonUserBusinesscard
- (instancetype)init {
	if (self = [super init]) {
		_title = @"";
		_department = @"";
		
	}
	return self;
}

- (instancetype)initWithJson:(NSDictionary *)json {
	if (self = [self init]) {
		id attribute = nil;

		attribute = [json objectForKey:@"title"];
		if (attribute) {
			_title = attribute;
			
		}
		else {
			_title = @"";
			}
	attribute = [json objectForKey:@"department"];
		if (attribute) {
			_department = attribute;
			
		}
		else {
			_department = @"";
			}
	
	}
	return self;
}

- (NSDictionary *)encodeToJson {
	NSMutableDictionary *json = [NSMutableDictionary dictionary];

	[json setObject:_title forKey:@"title"];
	[json setObject:_department forKey:@"department"];
	
	return json;
}


- (void)setTitle:(NSString *)title {
	NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"\w{3}" options:0 error:nil];
	if (![regex numberOfMatchesInString:title options:0 range:NSMakeRange(0, title.length)]) {
		[NSException raise:@"UModel" format:@"mismatch regex"];
		return;
	}
	
	_title = title;
}

- (void)setDepartment:(NSString *)department {
	
	_department = department;
}

@end


@implementation UMCommonUserAddress
- (instancetype)init {
	if (self = [super init]) {
		_latitude = 0;
		_longitude = 0;
		_location = @"";
		
	}
	return self;
}

- (instancetype)initWithJson:(NSDictionary *)json {
	if (self = [self init]) {
		id attribute = nil;

		attribute = [json objectForKey:@"latitude"];
		if (attribute) {
			_latitude = ((NSNumber *)attribute).doubleValue;
			
		}
		else {
			_latitude = 0;
			}
	attribute = [json objectForKey:@"longitude"];
		if (attribute) {
			_longitude = ((NSNumber *)attribute).doubleValue;
			
		}
		else {
			_longitude = 0;
			}
	attribute = [json objectForKey:@"location"];
		if (attribute) {
			_location = attribute;
			
		}
		else {
			_location = @"";
			}
	
	}
	return self;
}

- (NSDictionary *)encodeToJson {
	NSMutableDictionary *json = [NSMutableDictionary dictionary];

	[json setObject:@(_latitude) forKey:@"latitude"];
	[json setObject:@(_longitude) forKey:@"longitude"];
	[json setObject:_location forKey:@"location"];
	
	return json;
}


- (void)setLatitude:(double )latitude {
	if ((latitude < 0)
		|| (latitude >= 360)) {
		[NSException raise:@"UModel" format:@"out of range"];
		return;
	}
	
	_latitude = latitude;
}

- (void)setLongitude:(double )longitude {
	if ((longitude < 0)
		|| (longitude >= 360)) {
		[NSException raise:@"UModel" format:@"out of range"];
		return;
	}
	
	_longitude = longitude;
}

- (void)setLocation:(NSString *)location {
	
	_location = location;
}

@end



@implementation UMNetworkUserInfoRequest
- (instancetype)init {
	if (self = [super init]) {
		_uid = @"";
		_auth = @"";
		
	}
	return self;
}

- (instancetype)initWithJson:(NSDictionary *)json {
	if (self = [self init]) {
		id attribute = nil;

		attribute = [json objectForKey:@"uid"];
		if (attribute) {
			_uid = attribute;
			
		}
		else {
			_uid = @"";
			}
	attribute = [json objectForKey:@"auth"];
		if (attribute) {
			_auth = attribute;
			
		}
		else {
			_auth = @"";
			}
	
	}
	return self;
}

- (NSDictionary *)encodeToJson {
	NSMutableDictionary *json = [NSMutableDictionary dictionary];

	[json setObject:_uid forKey:@"uid"];
	[json setObject:_auth forKey:@"auth"];
	
	return json;
}


- (void)setUid:(NSString *)uid {
	NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"[0-9a-f]{32}" options:0 error:nil];
	if (![regex numberOfMatchesInString:uid options:0 range:NSMakeRange(0, uid.length)]) {
		[NSException raise:@"UModel" format:@"mismatch regex"];
		return;
	}
	
	_uid = uid;
}

- (void)setAuth:(NSString *)auth {
	NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"[0-9a-f]{32}" options:0 error:nil];
	if (![regex numberOfMatchesInString:auth options:0 range:NSMakeRange(0, auth.length)]) {
		[NSException raise:@"UModel" format:@"mismatch regex"];
		return;
	}
	
	_auth = auth;
}

@end


@implementation UMNetworkUserInfoResponse
- (instancetype)init {
	if (self = [super init]) {
		_info = [UMCommonUserInfo new];
		
	}
	return self;
}

- (instancetype)initWithJson:(NSDictionary *)json {
	if (self = [self init]) {
		id attribute = nil;

		attribute = [json objectForKey:@"info"];
		if (attribute) {
			_info = [[UMCommonUserInfo alloc] initWithJson:attribute];
			
		}
		else {
			_info = [UMCommonUserInfo new];
			}
	
	}
	return self;
}

- (NSDictionary *)encodeToJson {
	NSMutableDictionary *json = [NSMutableDictionary dictionary];

	[json setObject:[_info encodeToJson] forKey:@"info"];
	
	return json;
}


- (void)setInfo:(UMCommonUserInfo *)info {
	
	_info = info;
}

@end

