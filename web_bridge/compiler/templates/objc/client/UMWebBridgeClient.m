#import "UMWebBridgeClient.h"

@interface UMWebBridgeTransport<NSURLConnectionDataDelegate>
{
	NSURL *_url;
	NSInteger _timeout;
	void (^_callback)(NSDictionary *responseJson, NSInteger error);
	NSMutableData *_responseData;
}
- (instancetype)initWithVersion:(NSString *)version withInterface:(NSString* )interface withProtocol:(NSString *)protocol withHost:(NSString *)host withPort:(NSInteger)port withTimeout:(NSInteger)timeout callback:(void (^)(NSDictionary *responseJson, NSInteger error))callback;
- (void)makeRequest:(NSDictionary *)requestJson;
@end

@implementation UMWebBridgeTransport
- (instancetype)initWithVersion:(NSString *)version withInterface:(NSString* )interface withProtocol:(NSString *)protocol withHost:(NSString *)host withPort:(NSInteger)port withTimeout:(NSInteger)timeout callback:(void (^)(NSDictionary *responseJson, NSInteger error))callback {
	if (self = [super init]) {
		_url= [NSURL URLWithString:[NSString stringWithFormat:@"%@://%@:%@/web_bridge?ver=%@&interface=%@", protocol, host, @(port), version, interface]];
		_timeout = timeout;
		_callback = callback;
		_responseData = [NSMutableData data];
	}
	return self;
}

- (void)makeRequest:(NSDictionary *)requestJson {
	NSData *requestData = [NSJSONSerialization dataWithJSONObject: options:0 error:nil];

	NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:_url cachePolicy:NSURLRequestReloadIgnoringLocalAndRemoteCacheData timeoutInterval:_timeout];
	[request setHTTPMethod:@"POST"];
	[request setValue:@(requestData.length) forHTTPHeaderField:@"Content-Length"];
	[request setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];

	[[NSURLConnection alloc] initWithRequest:request delegate:self startImmediately:YES];
}

#pragma mark NSURLConnectionDataDelegate
- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
	NSUInteger code = [((NSHTTPURLResponse *)response) statusCode];
	if (statusCode != 200) {
		[connection cancel];
		_callback(nil, kUMWebBridgeResultServerError);
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
		_callback(nil, kUMWebBridgeResultServerError);
		return;
	}

	_callback(responseJson, kUMWebBridgeResultSucc);
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
	_callback(nil, kUMWebBridgeResultNetworkError);
}
@end

@implementation UMWebBridgeClient
{% for version in versions -%}
{% for interface in version.interfaces -%}
+ (void){{interface.name}}WithRequest:(UMCore{{ interface.request.namespace }}{{ interface.request.object }} *)request withResponseCallback:(void (^)(UMCore{{ interface.response.namespace }}{{ interface.response.object }} *response, NSInteger error))responseCallback {
	NSDictionary *requestJson = [request encodeToJson];
	UMWebBridgeTransport *transport = [[UMWebBridgeTransport alloc] initWithVersion:@"{{ version.name }}" withInterface:@"{{ interface.name }}" withProtocol:@"{{ interface.protocol }}" withHost:@"{{ interface.host }}" withPort:{{ interface.port }} withTimeout:{{ interface.timeout }} callback:^(NSDictionary *responseJson, NSInteger error) {
		if (error != kUMWebBridgeResultSucc) {
			responseCallback(nil, error);
			return;
		}

		UMCore{{ interface.response.namespace }}{{ interface.response.object }} *response = [[UMCore{{ interface.response.namespace }}{{ interface.response.object }} *response alloc] initWithJson:responseJson];
		responseCallback(response, nil);
	}];
	[transport makeRequest:requestJson];
}
{%- endfor %}
{%- endfor %}

@end
