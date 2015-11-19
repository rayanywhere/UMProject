#import "UMCore.h"

@implementation UMCore
- (instancetype)initWithJson:(NSString *)json {
	return [super init];
}

- (NSString *)encodeToJson {
	return @"";
}
@end
{% for namespace in namespaces %}
{% for object in namespace.objects %}

@implementation UMCore{{ namespace.name }}{{ object.name }}
- (instancetype)init {
	if (self = [super init]) {
		{% for attribute in object.attributes -%}
		{%- if attribute|um_attribute_is("STRING") -%}
		{%- if attribute.value|um_value_is("object") -%}
		_{{ attribute.name }} = kUMCore{{ attribute.value.namespace }}{{ attribute.value.object }}{{ attribute.value.constant }};
		{%- else -%}
		_{{ attribute.name }} = @"{{ attribute.value }}";
		{%- endif -%}
		{%- elseif attribute|um_attribute_is("FLOAT") || attribute|um_attribute_is("BOOLEAN") || attribute|um_attribute_is("INTEGER") -%}
		{%- if attribute.value|um_value_is("object") -%}
		_{{ attribute.name }} = kUMCore{{ attribute.value.namespace }}{{ attribute.value.object }}{{ attribute.value.constant }};
		{%- else -%}
		_{{ attribute.name }} = {{ attribute.value }};
		{%- endif -%}
		{%- elseif attribute|um_attribute_is("OBJECT") -%}
		_{{ attribute.name }} = [UMCore{{ attribute.value.namespace }}{{ attribute.value.object }} new];
		{%- elseif attribute|um_attribute_is("ARRAY") -%}
		_{{ attribute.name }} = [NSArray<UMCore{{ attribute.value.namespace }}{{ attribute.value.object }} *> array];
		{%- endif -%}
		{%- endfor %}
	}
	return self;
}

- (instancetype)initWithJson:(NSDictionary *)json {
	if (self = [self init]) {
		id attribute = nil;

		{% for attribute in object.attributes -%}
		attribute = [json objectForKey:@"{{ attribute.name }}"];
		if (attribute) {
			{% if attribute|um_attribute_is("STRING") -%}
			_{{ attribute.name }} = attribute;
			{%- elseif attribute|um_attribute_is("BOOLEAN") -%}
			_{{ attribute.name }} = ((NSNumber *)attribute).boolValue;
			{%- elseif attribute|um_attribute_is("FLOAT") -%}
			_{{ attribute.name }} = ((NSNumber *)attribute).doubleValue;
			{%- elseif attribute|um_attribute_is("INTEGER") -%}
			_{{ attribute.name }} = ((NSNumber *)attribute).integerValue;
			{%- elseif attribute|um_attribute_is("OBJECT") -%}
			_{{ attribute.name }} = [[UMCore{{ attribute.value.namespace }}{{ attribute.value.object }} alloc] initWithJson:attribute];
			{%- elseif attribute|um_attribute_is("ARRAY") -%}
			NSMutableArray<UMCore{{ attribute.value.namespace }}{{ attribute.value.object }} *> *array = [NSMutableArray<UMCore{{ attribute.value.namespace }}{{ attribute.value.object }} *> array];
			for(NSDictionary *item in attribute) {
				[array addObject:[[UMCore{{ attribute.value.namespace }}{{ attribute.value.object }} alloc] initWithJson:item]];
			}
			_{{ attribute.name }} = array;
			{%- endif %}
		}
		else {
			{% if attribute|um_attribute_is("STRING") -%}
			{%- if attribute.value|um_value_is("object") -%}
			_{{ attribute.name }} = kUMCore{{ attribute.value.namespace }}{{ attribute.value.object }}{{ attribute.value.constant }};
			{%- else -%}
			_{{ attribute.name }} = @"{{ attribute.value }}";
			{%- endif -%}
			{%- elseif attribute|um_attribute_is("FLOAT") || attribute|um_attribute_is("BOOLEAN") || attribute|um_attribute_is("INTEGER") -%}
			{%- if attribute.value|um_value_is("object") -%}
			_{{ attribute.name }} = kUMCore{{ attribute.value.namespace }}{{ attribute.value.object }}{{ attribute.value.constant }};
			{%- else -%}
			_{{ attribute.name }} = {{ attribute.value }};
			{%- endif -%}
			{%- elseif attribute|um_attribute_is("OBJECT") -%}
			_{{ attribute.name }} = [UMCore{{ attribute.value.namespace }}{{ attribute.value.object }} new];
			{%- elseif attribute|um_attribute_is("ARRAY") -%}
			_{{ attribute.name }} = [NSArray<UMCore{{ attribute.value.namespace }}{{ attribute.value.object }} *> array];
			{%- endif -%}
		}
	{%- endfor %}
	}
	return self;
}

- (NSDictionary *)encodeToJson {
	NSMutableDictionary *json = [NSMutableDictionary dictionary];

	{% for attribute in object.attributes -%}
	{%- if attribute|um_attribute_is("STRING") -%}
	[json setObject:_{{ attribute.name }} forKey:@"{{ attribute.name }}"];
	{%- elseif attribute|um_attribute_is("BOOLEAN") || attribute|um_attribute_is("FLOAT") || attribute|um_attribute_is("INTEGER") -%}
	[json setObject:@(_{{ attribute.name }}) forKey:@"{{ attribute.name }}"];
	{%- elseif attribute|um_attribute_is("OBJECT") -%}
	[json setObject:[_{{ attribute.name }} encodeToJson] forKey:@"{{ attribute.name }}"];
	{%- elseif attribute|um_attribute_is("ARRAY") -%}
	{
		NSMutableArray *array = [NSMutableArray array];
		for(UMCore{{ attribute.value.namespace}}{{ attribute.value.object }} *item in _{{ attribute.name }}) {
			[array addObject:[item encodeToJson]];
		}
		[json setObject:array forKey:@"{{ attribute.name }}"];
	}
	{%- endif -%}
	{%- endfor %}
	return json;
}

{% for attribute in object.attributes %}
- (void)set{{ attribute.name|ucfirst }}:({% if attribute|um_attribute_is("STRING") %}NSString *{% elseif attribute|um_attribute_is("INTEGER") %}NSInteger {% elseif attribute|um_attribute_is("FLOAT") %}double {% elseif attribute|um_attribute_is("BOOLEAN") %}BOOL {% elseif attribute|um_attribute_is("OBJECT") || attribute|um_attribute_is("ARRAY") %}UMCore{{attribute.value.namespace}}{{attribute.value.object}} *{% endif %}){{ attribute.name }} {
	{% if attribute.filter -%}
	{%- if attribute.filter|um_filter_is("object") -%}
	if (({{ attribute.name }} <{% if !attribute.filter.include.lower %}={% endif %} {{ attribute.filter.range.lower }})
		|| ({{ attribute.name}} >{% if !$attribute.filter.include.upper %}={% endif %} {{ attribute.filter.range.upper }})) {
		[NSException raise:@"UMCore" format:@"out of range"];
		return;
	}
	{%- else -%}
	NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"{{ attribute.filter }}" options:0 error:nil];
	if (![regex numberOfMatchesInString:{{ attribute.name }} options:0 range:NSMakeRange(0, {{ attribute.name }}.length)]) {
		[NSException raise:@"UMCore" format:@"mismatch regex"];
		return;
	}
	{%- endif -%}
	{%- endif %}
	_{{ attribute.name }} = {{ attribute.name }};
}
{%- endfor %}
@end
{%- endfor -%}
{%- endfor %}
