#import "UMWebClient.h"

@interface UMWebTransport : NSObject<NSURLConnectionDataDelegate>
{
	NSURL *_url;
	NSInteger _timeout;
	void (^_callback)(NSDictionary *responseJson, NSInteger error);
	NSMutableData *_responseData;
}
- (instancetype)initWithVersion:(NSString *)version withInterface:(NSString* )interface withProtocol:(NSString *)protocol withHost:(NSString *)host withPort:(NSInteger)port withTimeout:(NSInteger)timeout callback:(void (^)(NSDictionary *responseJson, NSInteger error))callback;
- (void)makeRequest:(NSDictionary *)requestJson;
@end

@implementation UMWebTransport
- (instancetype)initWithVersion:(NSString *)version withInterface:(NSString* )interface withProtocol:(NSString *)protocol withHost:(NSString *)host withPort:(NSInteger)port withTimeout:(NSInteger)timeout callback:(void (^)(NSDictionary *responseJson, NSInteger error))callback {
	if (self = [super init]) {
		_url= [NSURL URLWithString:[NSString stringWithFormat:@"%@://%@:%@/web?ver=%@&interface=%@", protocol, host, @(port), version, interface]];
		_timeout = timeout;
		_callback = callback;
		_responseData = [NSMutableData data];
	}
	return self;
}

- (void)makeRequest:(NSDictionary *)requestJson {
	NSData *requestData = [NSJSONSerialization dataWithJSONObject:requestJson options:0 error:nil];

	NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:_url cachePolicy:NSURLRequestReloadIgnoringLocalAndRemoteCacheData timeoutInterval:_timeout];
	[request setHTTPMethod:@"POST"];
	[request setValue:[NSString stringWithFormat:@"%@", @(requestData.length)] forHTTPHeaderField:@"Content-Length"];
	[request setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];

	NSURLConnection *connection = [[NSURLConnection alloc] initWithRequest:request delegate:self startImmediately:NO];
	[connection start];
}

#pragma mark NSURLConnectionDataDelegate
- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
	NSUInteger statusCode = [((NSHTTPURLResponse *)response) statusCode];
	if (statusCode != 200) {
		[connection cancel];
		_callback(nil, kUMWebResultServerError);
		return;
	}
	[_responseData setLength:0];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
	[_responseData appendData:data];
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
	NSError* error = nil;
	NSDictionary* responseJson = [NSJSONSerialization JSONObjectWithData:_responseData options:kNilOptions error:&error];
	if (error || !responseJson) {
		_callback(nil, kUMWebResultServerError);
		return;
	}

	_callback(responseJson, kUMWebResultSucc);
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
	_callback(nil, kUMWebResultNetworkError);
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
