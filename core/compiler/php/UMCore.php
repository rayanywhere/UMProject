<?php
namespace UMCore {
	abstract class Model {
		abstract public function encodeToJson();
	}
}


namespace UMCore\Basic {
	class User extends \UMCore\Model {
		
		private $_name;
		private $_age;
		

		public function __construct($json = null) {
			if (isset($json) && (isset($json['name']))) {
				$this->_name = (string)($json['name']);
				
			}
			else {
				$this->_name = "";
				
			}
			if (isset($json) && (isset($json['age']))) {
				$this->_age = (int)($json['age']);
				
			}
			else {
				$this->_age = 0;
				
			}
			
		}

		public function encodeToJson() {
			$json = array();
			$json['name'] = $this->_name;
			$json['age'] = $this->_age;
			
			return $json;
		}
		

		public function getName() {
			return $this->_name;
		}

		public function setName($name) {
			
			$this->_name = $name;
		}	
		

		public function getAge() {
			return $this->_age;
		}

		public function setAge($age) {
			
			$this->_age = $age;
		}	
		
	}
	
}
namespace UMCore\Http {
	class GetUserRequest extends \UMCore\Model {
		
		

		public function __construct($json = null) {
			
		}

		public function encodeToJson() {
			$json = array();
			
			return $json;
		}
		
	}
	class GetUserResponse extends \UMCore\Model {
		
		private $_user;
		

		public function __construct($json = null) {
			if (isset($json) && (isset($json['user']))) {
				$this->_user = new \UMCore\Basic\User($json['user']);
				
			}
			else {
				$this->_user = new \UMCore\Basic\User();
				
			}
			
		}

		public function encodeToJson() {
			$json = array();
			$json['user'] = $this->_user->encodeToJson();
			
			return $json;
		}
		

		public function getUser() {
			return $this->_user;
		}

		public function setUser($user) {
			
			$this->_user = $user;
		}	
		
	}
	class SetUserRequest extends \UMCore\Model {
		
		private $_user;
		

		public function __construct($json = null) {
			if (isset($json) && (isset($json['user']))) {
				$this->_user = new \UMCore\Basic\User($json['user']);
				
			}
			else {
				$this->_user = new \UMCore\Basic\User();
				
			}
			
		}

		public function encodeToJson() {
			$json = array();
			$json['user'] = $this->_user->encodeToJson();
			
			return $json;
		}
		

		public function getUser() {
			return $this->_user;
		}

		public function setUser($user) {
			
			$this->_user = $user;
		}	
		
	}
	class SetUserResponse extends \UMCore\Model {
		
		

		public function __construct($json = null) {
			
		}

		public function encodeToJson() {
			$json = array();
			
			return $json;
		}
		
	}
	
}
