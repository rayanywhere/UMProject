#import "UMWebClient.h"

@interface UMWebTransport : NSObject<NSURLSessionDelegate>
{
	NSURL *_url;
	NSInteger _timeout;
	void (^_callback)(NSDictionary *responseJson, NSInteger error);
}
- (instancetype)initWithVersion:(NSString *)version withInterface:(NSString* )interface withProtocol:(NSString *)protocol withHost:(NSString *)host withPort:(NSInteger)port withTimeout:(NSInteger)timeout callback:(void (^)(NSDictionary *responseJson, NSInteger error))callback;
- (void)makeRequest:(NSDictionary *)requestJson;
@end

@implementation UMWebTransport
- (instancetype)initWithVersion:(NSString *)version withInterface:(NSString* )interface withProtocol:(NSString *)protocol withHost:(NSString *)host withPort:(NSInteger)port withTimeout:(NSInteger)timeout callback:(void (^)(NSDictionary *responseJson, NSInteger error))callback {
	if (self = [super init]) {
		_url= [NSURL URLWithString:[NSString stringWithFormat:@"%@://%@:%@/web?v=%@&i=%@", protocol, host, @(port), [version stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]], [interface stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]]]];
		_timeout = timeout;
		_callback = callback;
	}
	return self;
}

- (void)makeRequest:(NSDictionary *)requestJson {
	NSData *requestData = [NSJSONSerialization dataWithJSONObject:requestJson options:0 error:nil];

	NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:_url cachePolicy:NSURLRequestReloadIgnoringLocalAndRemoteCacheData timeoutInterval:_timeout];
	[request setHTTPMethod:@"POST"];
	[request setValue:[NSString stringWithFormat:@"%@", @(requestData.length)] forHTTPHeaderField:@"Content-Length"];
	[request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
	[request setHTTPBody:requestData];

	NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration] delegate:self delegateQueue:[NSOperationQueue mainQueue]];
	NSURLSessionDataTask *postTask = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error)
	{
		NSUInteger statusCode = [((NSHTTPURLResponse *)response) statusCode];
		if (statusCode != 200) {
			_callback(nil, kUMWebResultServerError);
			return;
		}

		error = nil;
		NSDictionary* responseJson = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&error];
		if (error || !responseJson) {
			_callback(nil, kUMWebResultServerError);
			return;
		}

		_callback(responseJson, kUMWebResultSucc);
	}];
	[postTask resume];
}

@end

@implementation UMWebClient
{% for version in versions -%}
{% for interface in version.interfaces -%}
+ (void){{interface.name}}WithRequest:(UMCore{{ interface.request.namespace }}{{ interface.request.object }} *)request withResponseCallback:(void (^)(UMCore{{ interface.response.namespace }}{{ interface.response.object }} *response, NSInteger error))responseCallback {
	NSDictionary *requestJson = [request encodeToJson];
	UMWebTransport *transport = [[UMWebTransport alloc] initWithVersion:@"{{ version.name }}" withInterface:@"{{ interface.name }}" withProtocol:@"{{ interface.protocol }}" withHost:@"{{ interface.host }}" withPort:{{ interface.port }} withTimeout:{{ interface.timeout }} callback:^(NSDictionary *responseJson, NSInteger error) {
		if (error != kUMWebResultSucc) {
			responseCallback(nil, error);
			return;
		}

		UMCore{{ interface.response.namespace }}{{ interface.response.object }} *response = [[UMCore{{ interface.response.namespace }}{{ interface.response.object }} alloc] initWithJson:responseJson];
		responseCallback(response, 0);
	}];
	[transport makeRequest:requestJson];
}
{%- endfor %}
{%- endfor %}

@end
