var coreParser = require('../../core/compiler/parser.js');
var jsonCore = [];
var jsonWeb = [];

exports.parse = function(coreFile, webFile, callback) {
	coreParser.parse(coreFile, function(err, json) {
		if (err) {
			callback(err, null);
			return;
		}

		jsonCore = json;
		require('fs').readFile(webFile, 'utf8', function(err, data) {
				try {
					if (err) {
						callback(err, null);
						return;
					}

					data = data.replace(/^\uFEFF/, '');
					jsonWeb = JSON.parse(data);
					validate();
					callback(false, jsonWeb);
				}
				catch(e) {
					callback(e, null);
				}
			});
	});
};

function validate() {
	jsonWeb.forEach(function(version) {
		validateVersion(version);
	});
}

function validateVersion(version) {
	if ((typeof version.name != "string")
		|| (typeof version.comment != "string")
		|| (typeof version.interfaces != "object")) {
		throw new Error("version(" + JSON.stringify(version) + ") validation failed");
	}

	version.interfaces.forEach(function(interface) {
		validateInterface(interface);
	});
}

function validateInterface(interface) {
	if ((typeof interface.name != "string")
		|| (typeof interface.comment != "string")
		|| (typeof interface.request != "object")
		|| (typeof interface.response != "object")
		|| (typeof interface.host != "string")
		|| (typeof interface.port != "number")
		|| (typeof interface.timeout != "number")
		|| (typeof interface.protocol != "string")) {
		throw new Error("interface(" + JSON.stringify(interface) + ") validation failed");
	}

	validateReference(interface.request);
	validateReference(interface.response);
}

function validateReference(reference) {
	if ((typeof reference.namespace != "string")
		|| (typeof reference.object != "string")) {
		throw new Error("reference(" + JSON.stringify(reference) + ") validation failed");
	}

	var targetNamespace = false;
	jsonCore.forEach(function(namespace) {
				if (namespace.name == reference.namespace) {
					targetNamespace = namespace;
				}
			});

	if (!targetNamespace) {
		throw new Error("bad reference to [" + reference.namespace + "." + reference.object + "]");
	}

	var targetObject = false;
	targetNamespace.objects.forEach(function(object) {
				if (object.name == reference.object) {
					targetObject = object;
				}
			});
	if (!targetObject) {
		throw new Error("bad reference to [" + reference.namespace + "." + reference.object + "]");
	}
}
