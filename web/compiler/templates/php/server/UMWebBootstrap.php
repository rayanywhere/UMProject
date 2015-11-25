<?php
namespace UMWeb {
	class Bootstrap {
		private static $_paramsMap = array(
					{% for version in versions %}
						'{{ version.name }}' => array(
					{% for interface in version.interfaces %}
							'{{ interface.name }}' => array('request' => '\UMCore\{{ interface.request.namespace }}\{{ interface.request.object }}', 'response' => '\UMCore\{{ interface.response.namespace }}\{{ interface.response.object }}'),
					{% endfor %}
						),
					{% endfor %}
				);

		public static function run() {
			$version = $_GET['v'];
			$interface = $_GET['i'];

			if (isset(self::$_paramsMap[$version]) && isset(self::$_paramsMap[$version][$interface])) {
				require_once __DIR__ . '/' . $version . '/UMWebServer.php';

				$requestJson = json_decode(file_get_contents('php://input'), true);

				$requestClassName = self::$_paramsMap[$version][$interface]['request'];
				$responseClassName = self::$_paramsMap[$version][$interface]['response'];
				$request = new $requestClassName($requestJson);
				$response = new $responseClassName();

				\UMWeb\Server::{$interface}($request, $response);
				header("Content-Type: application/json");
				die(json_encode($response->encodeToJson()));
			}
		}
	}
}
