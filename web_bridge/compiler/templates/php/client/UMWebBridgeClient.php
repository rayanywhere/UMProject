<?php
namespace UMWebBridge {
	class Client {
		const RESULT_SUCC = 0;
		const RESULT_ERROR_NETWORK = -1;
		const RESULT_ERROR_SERVER = -2;

		{% for version in versions -%}
		{% for interface in version.interfaces -%}
		public static function {{ interface.name }}(\UMCore\{{ interface.request.namespace }}\{{ interface.request.object }} $request, \UMCore\{{ interface.response.namespace }}\{{ interface.response.object }} &$response) {
			$requestJson = $request->encodeToJson();
			$responseJson = array();
			$result = self::_makeRequest($requestJson, $responseJson, "{{ version.name }}", "{{ interface.name }}", "{{ interface.protocol }}", "{{ interface.host }}", {{ interface.port }}, {{ interface.timeout }});
			if ($result != self::RESULT_SUCC) {
				return $result;
			}

			$response = new \UMCore\{{ interface.response.namespace }}\{{ interface.response.object }}($responseJson);
			return self::RESULT_SUCC;
		}
		{%- endfor %}
		{%- endfor %}
		private static function _makeRequest($requestJson, &$responseJson, $version, $interface, $protocol, $host, $port, $timeout) {
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $protocol . '://' . $host . ':' . $port . '/web_bridge?ver=' . urlencode($version) . '&interface=' . urlencode($interface));
			curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
			curl_setopt($ch, CURLOPT_POST,           1 );
			curl_setopt($ch, CURLOPT_POSTFIELDS,     json_encode($requestJson) ); 
			curl_setopt($ch, CURLOPT_HTTPHEADER,     array('Content-Type: text/plain')); 

			$responseData = curl_exec($ch);
			if ($responseData === FALSE) {
				return self::RESULT_ERROR_NETWORK;
			}

			$responseJson = @json_decode($responseData, true);
			if (!$responseJson) {
				return self::RESULT_ERROR_SERVER;
			}
			return self::RESULT_SUCC;
		}
	}
}
