<?php
namespace UMWeb {
	class Bootstrap {
		private static $_paramsMap = array(
					
						'v1' => array(
					
							'getUser' => array('request' => '\UMCore\Http\GetUserRequest', 'response' => '\UMCore\Http\GetUserResponse'),
					
							'setUser' => array('request' => '\UMCore\Http\SetUserRequest', 'response' => '\UMCore\Http\SetUserResponse'),
					
						),
					
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
