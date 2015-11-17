<?php
namespace UM {
	abstract class Model {
		abstract public function encodeToJson();
	}
}

{% for namespace in namespaces %}
namespace UM\{{ namespace.name }} {
	{% for object in namespace.objects -%}
	class {{ object.name }} extends \UM\Model {
		{% for constant in object.constants -%}
		const {{ constant.name }} = {{ constant.value }};
		{%- endfor %}
		{% for attribute in object.attributes -%}
		private $_{{ attribute.name }};
		{%- endfor %}

		public function __construct($json = null) {
			{% for attribute in object.attributes -%}
			if (isset($json) && (isset($json['{{ attribute.name }}']))) {
				{% if attribute|um_attribute_is("STRING") -%}
				$this->_{{ attribute.name }} = (string)($json['{{ attribute.name }}']);
				{%- elseif attribute|um_attribute_is("BOOLEAN") -%}
				$this->_{{ attribute.name }} = (boolean)($json['{{ attribute.name }}']);
				{%- elseif attribute|um_attribute_is("FLOAT") -%}
				$this->_{{ attribute.name }} = (double)($json['{{ attribute.name }}']);
				{%- elseif attribute|um_attribute_is("INTEGER") -%}
				$this->_{{ attribute.name }} = (int)($json['{{ attribute.name }}']);
				{%- elseif attribute|um_attribute_is("OBJECT") -%}
				$this->_{{ attribute.name }} = new \UM\{{ attribute.value.namespace }}\{{ attribute.value.object }}($json['{{ attribute.name }}']);
				{%- elseif attribute|um_attribute_is("ARRAY") -%}
				$this->_{{ attribute.name }} = [];
				foreach($json['{{ attribute.name }}'] as $item) {
					$this->_{{ attribute.name }}[] = new \UM\{{ attribute.value.namespace }}\{{ attribute.value.object }}($item);
				}
				{%- endif %}
			}
			else {
				{% if attribute|um_attribute_is("STRING") -%}
				{%- if attribute.value|um_value_is("object") -%}
				$this->_{{ attribute.name }} = \UM\{{ attribute.value.namespace }}\{{ attribute.value.object }}::{{ attribute.value.const }};
				{%- else -%}
				$this->_{{ attribute.name }} = "{{ attribute.value }}";
				{%- endif -%}
				{%- elseif attribute|um_attribute_is("BOOLEAN") || attribute|um_attribute_is("FLOAT") || attribute|um_attribute_is("INTEGER") -%}
				{%- if attribute.value|um_value_is("object") -%}
				$this->_{{ attribute.name }} = \UM\{{ attribute.value.namespace }}\{{ attribute.value.object }}::{{ attribute.value.constant }};
				{%- else -%}
				$this->_{{ attribute.name }} = {{ attribute.value }};
				{%- endif -%}
				{%- elseif attribute|um_attribute_is("OBJECT") -%}
				$this->_{{ attribute.name }} = new \UM\{{ attribute.value.namespace }}\{{ attribute.value.object }}();
				{%- elseif attribute|um_attribute_is("ARRAY") -%}
				$this->_{{ attribute.name }} = [];
				{%- endif %}
			}
			{%- endfor %}
		}

		public function encodeToJson() {
			$json = array();
			{% for attribute in object.attributes -%}
			{% if attribute|um_attribute_is("STRING") || attribute|um_attribute_is("INTEGER") || attribute|um_attribute_is("FLOAT") || attribute|um_attribute_is("BOOLEAN") -%}
			$json['{{ attribute.name }}'] = $this->_{{ attribute.name }};
			{%- elseif attribute|um_attribute_is("OBJECT") -%}
			$json['{{ attribute.name }}'] = $this->_{{ attribute.name }}->encodeToJson();
			{%- elseif attribute|um_attribute_is("ARRAY") -%}
			{
				$array = [];
				foreach($this->_{{ attribute.name }} as $item) {
					$array[] = $item->encodeToJson();
				}
				$json['{{ attribute.name }}'] = $array;
			}
			{%- endif -%}
			{%- endfor %}
			return $json;
		}
		{% for attribute in object.attributes %}

		public function get{{ attribute.name|ucfirst }}() {
			return $this->_{{ attribute.name }};
		}

		public function set{{ attribute.name|ucfirst }}(${{ attribute.name }}) {
			{% if attribute.filter -%}
			{%- if attribute.filter|um_filter_is("string") -%}
			if (!preg_match('/{{ attribute.filter }}>/u', ${{ attribute.name }})) {
				throw new Exception('mismatch regex');
				return;
			}
			{% elseif attribute.filter|um_filter_is("object") -%}
			if ((${{ attribute.name }} <{% if !attribute.filter.include.lower %}=<{% endif %} {{ attribute.filter.range.lower }}) || (${{ attribute.name }} >{% if !attribute.filter.include.upper %}={% endif %} {{ attribute.filter.range.upper }})) {
				throw new Exception('out of range');
				return;
			}
			{%- endif -%}
			{%- endif %}
			$this->_{{ attribute.name }} = ${{ attribute.name }};
		}	
		{% endfor %}
	}
	{% endfor %}
}

{%- endfor %}
