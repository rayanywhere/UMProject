#import <Foundation/Foundation.h>
#import "UMCore.h"

const NSInteger kUMWebBridgeResultSucc = 0;
const NSInteger kUMWebBridgeResultNetworkError = -1;
const NSInteger kUMWebBridgeResultServerError = -2;

@interface UMWebBridgeClient : NSObject
{% for version in versions -%}
{% for interface in version.interfaces -%}
+ (void){{interface.name}}WithRequest:(UMCore{{ interface.request.namespace }}{{ interface.request.object }} *)request withResponseCallback:(void (^)(UMCore{{ interface.response.namespace }}{{ interface.response.object }} *response, NSInteger error))responseCallback;
{%- endfor %}
{%- endfor %}
@end
