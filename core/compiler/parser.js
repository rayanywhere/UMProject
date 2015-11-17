var fs = require('fs')
var json = [];

exports.parse = function(filename, callback) {
	require('fs').readFile(filename, 'utf8', function(err, data) {
		try {
			if (err) {
				callback(err, null);
				return;
			}

			json = JSON.parse(data);
			validate();
			callback(false, json);
		}
		catch(e) {
			callback(e, null);
		}
	});
};

function validate() {
	json.forEach(function(namespace) {
				validateNamespace(namespace);
			});
}

function validateNamespace(namespace) {
	if ((typeof namespace.name != "string")
		|| (typeof namespace.comment != "string")
		|| (typeof namespace.objects != "object")) {
		throw new Error("namespace(" + JSON.stringify(namespace) + ") validation failed");
	}

	namespace.objects.forEach(function(object) {
				validateObject(object);
			});
}

function validateObject(object) {
	if ((typeof object.name != "string")
		|| (typeof object.comment != "string")
		|| (typeof object.constants != "object")
		|| (typeof object.attributes != "object")) {
		throw new Error("object(" + JSON.stringify(object) + ") validation failed");
	}

	object.constants.forEach(function(constant) {
				validateConstant(constant);
			});

	object.attributes.forEach(function(attribute) {
				validateAttribute(attribute);
			});
}

function validateConstant(constant) {
	if ((typeof constant.name != "string")
		|| (typeof constant.comment != "string")
		|| (typeof constant.type != "string")) {
		throw new Error("constant(" + JSON.stringify(constant) + ") validation failed");
	}

	validateConstantValue(constant);
}

function validateConstantValue(constant) {
	switch (constant.type) {
		case "INTEGER":
		case "FLOAT":
			if (typeof constant.value != "number") {
				throw new Error("constant(" + JSON.stringify(constant) + ") value type mismatch, expecting NUMBER");
			}
			break;
		case "BOOLEAN":
			if (typeof constant.value != "boolean") {
				throw new Error("constant(" + JSON.stringify(constant) + ") value type mismatch, expecting BOOLEAN");
			}
			break;
		case "STRING":
			if (typeof constant.value != "string") {
				throw new Error("constant(" + JSON.stringify(constant) + ") value type mismatch, expecting STRING");
			}
			break;
		default:
			throw new Error("constant(" + JSON.stringify(constant) + ") type unknown");
			break;
	}
}

function validateAttribute(attribute) {
	if ((typeof attribute.name != "string")
		|| (typeof attribute.comment != "string")
		|| (typeof attribute.type != "string")) {
		throw new Error("attribute(" + JSON.stringify(attribute) + ") validation failed");
	}

	switch(attribute.type) {
		case "INTEGER":
		case "FLOAT":
			if ((typeof attribute.value != "number") && (typeof attribute.value != "object")) {
				throw new Error("attribute(" + JSON.stringify(attribute) + ") value type mismatch, expecting NUMBER/OBJECT");
			}
			break;
		case "BOOLEAN":
			if ((typeof attribute.value != "boolean") && (typeof attribute.value != "object")) {
				throw new Error("attribute(" + JSON.stringify(attribute) + ") value type mismatch, expecting BOOLEAN/OBJECT");
			}
			break;
		case "STRING":
			if ((typeof attribute.value != "string") && (typeof attribute.value != "object")) {
				throw new Error("attribute(" + JSON.stringify(attribute) + ") value type mismatch, expecting STRING/OBJECT");
			}
			break;
		case "OBJECT":
		case "ARRAY":
			if (typeof attribute.value != "object") {
				throw new Error("attribute(" + JSON.stringify(attribute) + ") value type mismatch, expecting OBJECT");
			}
			break;
		default:
			throw new Error("attribute(" + JSON.stringify(attribute) + ") type unknown");
			break;
	}

	validateAttributeFilter(attribute);
	validateAttributeValue(attribute);
}

function validateAttributeFilter(attribute) {
	if ((attribute.filter === null) && (typeof attribute.filter === "object")) {
		return;
	}

	switch(attribute.type) {
		case "INTEGER":
		case "FLOAT":
			if ((typeof attribute.filter != "object")
					|| (typeof attribute.filter.range != "object")
					|| (typeof attribute.filter.include != "object") 
					|| (typeof attribute.filter.range.upper != "number")
					|| (typeof attribute.filter.range.lower != "number")
					|| (typeof attribute.filter.include.upper != "boolean")
					|| (typeof attribute.filter.include.lower != "boolean")) {
				throw new Error("attribute filter(" + JSON.stringify(attribute.filter) + ") type mismatch, expecting {range:{upper,lower},include{upper,lower}} object");
			}
			break;
		case "STRING":
			if ((typeof attribute.filter != "string")
					|| (attribute.filter.length == "")) {
				throw new Error("attribute filter(" + JSON.stringify(attribute.filter) + ") type mismatch, expecting STRING");
			}
			break;
		default:
			break;
	}
	return;
}

function validateAttributeValue(attribute) {
	switch(attribute.type) {
		case "INTEGER":
		case "FLOAT":
			if (typeof attribute.value == "number") {
				return;
			}
			break;
		case "BOOLEAN":
			if (typeof attribute.value == "boolean") {
				return;
			}
			break;
		case "STRING":
			if (typeof attribute.value == "string") {
				return;
			}
			break;
		default:
			break;
	}

	switch(attribute.type) {
		case "INTEGER":
		case "FLOAT":
		case "BOOLEAN":
		case "STRING":
			if ((typeof attribute.value == "object")
				&& (typeof attribute.value.namespace == "string")
				&& (typeof attribute.value.object == "string")
				&& (typeof attribute.value.constant == "string")) {
					var reference = findConstant(attribute.value.namespace, attribute.value.object, attribute.value.constant);
					if (reference && (reference.type == attribute.type)) {
						return;
					}
			}
			break;
		case "OBJECT":
		case "ARRAY":
			if ((typeof attribute.value == "object")
				&& (typeof attribute.value.namespace == "string")
				&& (typeof attribute.value.object == "string")) {
					var reference = findObject(attribute.value.namespace, attribute.value.object);
					if (reference) {
						return;
					}
			}
			break;
		default:
			break;
	}
	throw new Error("bad attribute value(" + JSON.stringify(attribute) + ")");
}

function findNamespace(name) {
	var targetNamespace = null;
	json.forEach(function(namespace) {
				if (targetNamespace) 
					return;

				if (namespace.name == name) {
					targetNamespace = namespace;
				}
			});
	return targetNamespace;
}

function findObject(nameOfNamespace, nameOfObject) {
	var targetObject = null;
	var namespace = findNamespace(nameOfNamespace);
	if (namespace) {
		namespace.objects.forEach(function(object) {
					if (targetObject)
						return;
					if (object.name == nameOfObject) {
						targetObject = object;
					}
				});
	}
	return targetObject;
}

function findConstant(nameOfNamespace, nameOfObject, nameOfConstant) {
	var targetConstant = null;
	var object = findObject(nameOfNamespace, nameOfObject);
	if (object) {
		object.constants.forEach(function(constant) {
					if (targetConstant)
						return;
					if (constant.name == nameOfConstant) {
						targetConstant = constant;
					}
				});
	}
	return targetConstant;
}

function findAttribute(nameOfNamespace, nameOfObject, nameOfAttribute) {
	var targetAttribute = null;
	var object = findObject(nameOfNamespace, nameOfObject);
	if (object) {
		object.attributes.forEach(function(attribute) {
					if (targetAttribute)
						return;
					if (attribute.name == nameOfAttribute) {
						targetAttribute = attribute;
					}
				});
	}
	return targetAttribute;
}
