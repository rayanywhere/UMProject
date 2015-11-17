#import <Foundation/Foundation.h>

@interface UModel : NSObject
- (instancetype)initWithJson:(NSDictionary *)json;
- (NSDictionary *)encodeToJson;
@end
{% for namespace in namespaces %}
{%- for object in namespace.objects -%}
{%- for constant in object.constants -%}
const {% if constant|um_constant_is("STRING") %}NSString *{% elseif constant|um_constant_is("INTEGER") %}NSInteger {% elseif constant|um_constant_is("FLOAT") %}double {% elseif constant|um_constant_is("BOOLEAN") %}BOOL {% endif %}kUM{{ namespace.name }}{{ object.name }}{{ constant.name }} = {% if constant|um_constant_is("STRING") %}@"{{ constant.value }}"{% else %}{{ constant.value }}{% endif %};
{%- endfor -%}
{%- endfor -%}
{% endfor %}

{% for namespace in namespaces %}
{%- for object in namespace.objects -%}
@class UM{{ namespace.name }}{{ object.name }};
{%- endfor -%}
{%- endfor -%}

{% for namespace in namespaces %}

#pragma mark - Objects for namespace {{ namespace.name }}
{% for object in namespace.objects %}
@interface UM{{ namespace.name }}{{ object.name }} : UModel
{% for attribute in object.attributes -%}
@property ({% if attribute|um_attribute_is("INTEGER") || attribute|um_attribute_is("FLOAT") || attribute|um_attribute_is("BOOLEAN") %}assign{% else %}strong{% endif %}, nonatomic) {% if attribute|um_attribute_is("STRING") %}NSString *{% elseif attribute|um_attribute_is("INTEGER") %}NSInteger {% elseif attribute|um_attribute_is("FLOAT") %}double {% elseif attribute|um_attribute_is("BOOLEAN") %}BOOL {% elseif attribute|um_attribute_is("OBJECT") || attribute|um_attribute_is("ARRAY") %}UM{{attribute.value.namespace}}{{attribute.value.object}} *{% endif %}{{attribute.name}};
{%- endfor -%}
@end
{%- endfor -%}
{% endfor %}
