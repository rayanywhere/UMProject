package com.vanchu.lib.core.um;
import java.util.LinkedList;
import java.util.regex.Pattern;
import org.json.JSONObject;
import org.json.JSONArray;

public class UMCore {
	{% for namespace in namespaces -%}
	public static final class {{ namespace.name }} {
		{% for object in namespace.objects %}
		public static final class {{ object.name }} {
			{% for constant in object.constants -%}
			public static final {% if constant|um_constant_is("STRING") %}String{% elseif constant|um_constant_is("INTEGER") %}int{% elseif constant|um_constant_is("FLOAT") %}double{% elseif constant|um_constant_is("BOOLEAN") %}Boolean{% endif %} {{ constant.name }} = {% if constant|um_constant_is("STRING") %}"{{ constant.value }}"{% else %}{{ constant.value }}{% endif %};
			{%- endfor -%}
			{% for attribute in object.attributes -%}
			private {% if attribute|um_attribute_is("STRING") %}String{% elseif attribute|um_attribute_is("INTEGER") %}int{% elseif attribute|um_attribute_is("FLOAT") %}double{% elseif attribute|um_attribute_is("BOOLEAN") %}Boolean{% elseif attribute|um_attribute_is("OBJECT") %}{{ attribute.value.namespace }}.{{ attribute.value.object }}{% elseif attribute|um_attribute_is("ARRAY") %}LinkedList<{{ attribute.value.namespace }}.{{ attribute.value.object }}>{% endif %} _{{ attribute.name }};
			{%- endfor %}

			public {{ object.name }}() {
				{% for attribute in object.attributes -%}
				this._{{ attribute.name }} = <{$attribute|um_java_attribute_get_default_value}>;
				{%- if attribute|um_attribute_is("STRING") -%}
				{%- if attribute.value|um_value_is("object") -%}
				this._{{ attribute.name }} = {{ attribute.value.namespace }}.{{ attribute.value.object }}.{{ attribute.value.constant }};
				{%- else -%}
				this._{{ attribute.name }} = "{{ attribute.value }}";
				{%- endif -%}
				{%- elseif attribute|um_attribute_is("INTEGER") || attribute|um_attribute_is("FLOAT") || attribute|um_attribute_is("BOOLEAN") -%}
				{%- if attribute.value|um_value_is("object") -%}
				this._{{ attribute.name }} = {{ attribute.value.namespace }}.{{ attribute.value.object }}.{{ attribute.value.constant }};
				{%- else -%}
				this._{{ attribute.name }} = {{ attribute.value }};
				{%- endif -%}
				{%- elseif attribute|um_attribute_is("OBJECT") -%}
				this._{{ attribute.name }} = new {{ attribute.value.namespace }}.{{ attribute.value.object }}();
				{%- elseif attribute|um_attribute_is("ARRAY") -%}
				this._{{ attribute.name }} = new LinkedList<{{ attribute.value.namespace }}.{{ attribute.value.object }}>();
				{%- endif -%}
				{%- endfor %}
			}

			public {{ object.name }}(JSONObject json) {
				{% for attribute in object.attributes -%}
				if (json.has("{{ attribute.name }}")) {
					{% if attribute|um_attribute_is("STRING") -%}
					this._{{ attribute.name }} = json.getString("{{ attribute.name }}");
					{%- elseif attribute|um_attribute_is("BOOLEAN") -%}
					this._{{ attribute.name }} = json.getBoolean("{{ attribute.name }}");
					{%- elseif attribute|um_attribute_is("FLOAT") -%}
					this._{{ attribute.name }} = json.getDouble("{{ attribute.name }}");
					{%- elseif attribute|um_attribute_is("INTEGER") -%}
					this._{{ attribute.name }} = json.getInt("{{ attribute.name }}");
					{%- elseif attribute|um_attribute_is("OBJECT") -%}
					this._{{ attribute.name }} = new {{ attribute.value.namespace }}.{{ attribute.value.object }}(json.getJSONObject("{{ attribute.name }}"));
					{%- elseif attribute|um_attribute_is("ARRAY") -%}
					this._{{ attribute.name }} = new LinkedList<{{ attribute.value.namespace }}.{{ attribute.value.object }}>();
					for(Object item : json.getJSONArray("{{ attribute.name }}")) {
						this._{{ attribute.name }}.add(new {{ attribute.value.namespace }}.{{ attribute.value.object }}((JSONObject)item));
					}
					{%- endif %}
				}
				else {
					this._{{ attribute.name }} = <{$attribute|um_java_attribute_get_default_value}>;
					{%- if attribute|um_attribute_is("STRING") -%}
					{%- if attribute.value|um_value_is("object") -%}
					this._{{ attribute.name }} = {{ attribute.value.namespace }}.{{ attribute.value.object }}.{{ attribute.value.constant }};
					{%- else -%}
					this._{{ attribute.name }} = "{{ attribute.value }}";
					{%- endif -%}
					{%- elseif attribute|um_attribute_is("INTEGER") || attribute|um_attribute_is("FLOAT") || attribute|um_attribute_is("BOOLEAN") -%}
					{%- if attribute.value|um_value_is("object") -%}
					this._{{ attribute.name }} = {{ attribute.value.namespace }}.{{ attribute.value.object }}.{{ attribute.value.constant }};
					{%- else -%}
					this._{{ attribute.name }} = {{ attribute.value }};
					{%- endif -%}
					{%- elseif attribute|um_attribute_is("OBJECT") -%}
					this._{{ attribute.name }} = new {{ attribute.value.namespace }}.{{ attribute.value.object }}();
					{%- elseif attribute|um_attribute_is("ARRAY") -%}
					this._{{ attribute.name }} = new LinkedList<{{ attribute.value.namespace }}.{{ attribute.value.object }}>();
					{%- endif%}
				}
				{%- endfor %}
			}

			public JSONObject encodeToJson() {
				JSONObject json = new JSONObject();
				{% for attribute in object.attributes -%}
				{%- if attribute|um_attribute_is("STRING") || attribute|um_attribute_is("INTEGER") || attribute|um_attribute_is("FLOAT") || attribute|um_attribute_is("BOOLEAN") -%}
				json.put("{{ attribute.name }}", this._{{ attribute.name }});
				{%- elseif attribute|um_attribute_is("OBJECT") -%}
				json.put("{{ attribute.name }}", this._{{ attribute.name }}.encodeToJson());
				{%- elseif attribute|um_attribute_is("ARRAY") -%}
				{
					JSONArray array = new JSONArray();
					for({{ attribute.value.namespace }}.{{ attribute.value.object }} item : this._{{ attribute.name }}) {
						array.put(item.encodeToJson());
					}
					json.put("{{ attribute.name }}", array);
				}
				{%- endif -%}
				{%- endfor %}
				return json;
			}

			{% for attribute in object.attributes %}
			public {% if attribute|um_attribute_is("STRING") %}String{% elseif attribute|um_attribute_is("INTEGER") %}int{% elseif attribute|um_attribute_is("FLOAT") %}double{% elseif attribute|um_attribute_is("BOOLEAN") %}Boolean{% elseif attribute|um_attribute_is("OBJECT") %}{{ attribute.value.namespace }}.{{ attribute.value.object }}{% elseif attribute|um_attribute_is("ARRAY") %}LinkedList<{{ attribute.value.namespace }}.{{ attribute.value.object }}>{% endif %} get{{ attribute.name|ucfirst }}() {
				return this._{{ attribute.name }};
			}

			public void set{{ attribute.name|ucfirst }}({% if attribute|um_attribute_is("STRING") %}String{% elseif attribute|um_attribute_is("INTEGER") %}int{% elseif attribute|um_attribute_is("FLOAT") %}double{% elseif attribute|um_attribute_is("BOOLEAN") %}Boolean{% elseif attribute|um_attribute_is("OBJECT") %}{{ attribute.value.namespace }}.{{ attribute.value.object }}{% elseif attribute|um_attribute_is("ARRAY") %}LinkedList<{{ attribute.value.namespace }}.{{ attribute.value.object }}>{% endif %} {{ attribute.name }}) throws Exception {
				{% if attribute.filter -%}
				{%- if attribute.filter|um_filter_is("object") -%}
				if (({{ attribute.name }} <{% if !attribute.filter.include.lower %}={% endif %} {{ attribute.filter.range.lower }}) || ({{ attribute.name }} >{% if !attribute.filter.include.upper %}={% endif %} {{ attribute.filter.range.upper }})) {
					throw new Exception("out of range");
				}
				{%- else -%}
				if(!Pattern.compile("{{ attribute.filter }}").matcher({{ attribute.name }}).matches()) {
					throw new Exception("mismatch regex");
				}
				{%- endif -%}
				{%- endif %}
				this._{{ attribute.name }} = {{ attribute.name }};
			}
			{%- endfor %}
		}
		{%- endfor %}
	}
	{%- endfor %}
}
