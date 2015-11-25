<?php
namespace UMWeb {
	class Server {
		{% for interface in version.interfaces -%}
		public static function {{ interface.name }}(\UMCore\{{ interface.request.namespace }}\{{ interface.request.object }} $request, \UMCore\{{ interface.response.namespace }}\{{ interface.response.object }} &$response) {
		}
		{% endfor %}
	}
}
