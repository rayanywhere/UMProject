#import <Foundation/Foundation.h>
#import "UMCore.h"

#define kUMWebResultSucc 0
#define kUMWebResultNetworkError -1
#define kUMWebResultServerError -2

@interface UMWebClient : NSObject
{% for version in versions -%}
{% for interface in version.interfaces -%}
+ (void){{interface.name}}WithRequest:(UMCore{{ interface.request.namespace }}{{ interface.request.object }} *)request withResponseCallback:(void (^)(UMCore{{ interface.response.namespace }}{{ interface.response.object }} *response, NSInteger error))responseCallback;
{%- endfor %}
{%- endfor %}
@end
