#import "UMCore.h"

@implementation UMCore
- (instancetype)initWithJson:(NSString *)json {
	return [super init];
}

- (NSString *)encodeToJson {
	return @"";
}
@end



@implementation UMCoreBasicUser
- (instancetype)init {
	if (self = [super init]) {
		_name = @"";
		_age = 0;
		
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
	attribute = [json objectForKey:@"age"];
		if (attribute) {
			_age = ((NSNumber *)attribute).integerValue;
			
		}
		else {
			_age = 0;
			}
	
	}
	return self;
}

- (NSDictionary *)encodeToJson {
	NSMutableDictionary *json = [NSMutableDictionary dictionary];

	[json setObject:_name forKey:@"name"];
	[json setObject:@(_age) forKey:@"age"];
	
	return json;
}


- (void)setName:(NSString *)name {
	
	_name = name;
}

- (void)setAge:(NSInteger )age {
	
	_age = age;
}

@end



@implementation UMCoreHttpGetUserRequest
- (instancetype)init {
	if (self = [super init]) {
		
	}
	return self;
}

- (instancetype)initWithJson:(NSDictionary *)json {
	if (self = [self init]) {
		id attribute = nil;

		
	}
	return self;
}

- (NSDictionary *)encodeToJson {
	NSMutableDictionary *json = [NSMutableDictionary dictionary];

	
	return json;
}


@end


@implementation UMCoreHttpGetUserResponse
- (instancetype)init {
	if (self = [super init]) {
		_user = [UMCoreBasicUser new];
		
	}
	return self;
}

- (instancetype)initWithJson:(NSDictionary *)json {
	if (self = [self init]) {
		id attribute = nil;

		attribute = [json objectForKey:@"user"];
		if (attribute) {
			_user = [[UMCoreBasicUser alloc] initWithJson:attribute];
			
		}
		else {
			_user = [UMCoreBasicUser new];
			}
	
	}
	return self;
}

- (NSDictionary *)encodeToJson {
	NSMutableDictionary *json = [NSMutableDictionary dictionary];

	[json setObject:[_user encodeToJson] forKey:@"user"];
	
	return json;
}


- (void)setUser:(UMCoreBasicUser *)user {
	
	_user = user;
}

@end


@implementation UMCoreHttpSetUserRequest
- (instancetype)init {
	if (self = [super init]) {
		_user = [UMCoreBasicUser new];
		
	}
	return self;
}

- (instancetype)initWithJson:(NSDictionary *)json {
	if (self = [self init]) {
		id attribute = nil;

		attribute = [json objectForKey:@"user"];
		if (attribute) {
			_user = [[UMCoreBasicUser alloc] initWithJson:attribute];
			
		}
		else {
			_user = [UMCoreBasicUser new];
			}
	
	}
	return self;
}

- (NSDictionary *)encodeToJson {
	NSMutableDictionary *json = [NSMutableDictionary dictionary];

	[json setObject:[_user encodeToJson] forKey:@"user"];
	
	return json;
}


- (void)setUser:(UMCoreBasicUser *)user {
	
	_user = user;
}

@end


@implementation UMCoreHttpSetUserResponse
- (instancetype)init {
	if (self = [super init]) {
		
	}
	return self;
}

- (instancetype)initWithJson:(NSDictionary *)json {
	if (self = [self init]) {
		id attribute = nil;

		
	}
	return self;
}

- (NSDictionary *)encodeToJson {
	NSMutableDictionary *json = [NSMutableDictionary dictionary];

	
	return json;
}


@end

