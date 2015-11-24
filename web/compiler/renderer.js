var swig  = require("swig");

exports.render = function(json, target) {
	var root = {versions:json};

	var targets = target.split("/");
	var language = targets[0];
	var side = targets[1];

	switch(language) {
		case "php":
			return (side == "server") ? renderAsPHPServer(root) : renderAsPHPClient(root);
			break;
		case "objc":
			return (side == "server") ? renderAsObjcServer(root) : renderAsObjcClient(root);
			break;
		case "java":
			return (side == "server") ? renderAsJavaServer(root) : renderAsJavaClient(root);
			break;
		default:
			throw new Error("unknown language(" + language + ")");
			break;
	}
};

function renderAsPHPServer(root) {
	var files = [];
	root.versions.forEach(function(version) {
				var keyName = version.name + "/UMWebServer.php";
				var file = {
				};
				file[keyName] = swig.renderFile(__dirname + "/templates/php/server/UMWebServer.php", {version:version});
				files.push(file);
			});
	return files;
}

function renderAsPHPClient(root) {
	crossOutOverridedInterfaces(root);
	return [
			{
				"UMWebClient.php": swig.renderFile(__dirname + "/templates/php/client/UMWebClient.php", root)
			}
		];
}

function renderAsJavaServer(root) {
	throw new Error("not implemented java/server");
}

function renderAsJavaClient(root) {
	return [
				{
					"UMCore.java": swig.renderFile(__dirname + "/templates/java/UMCore.java", root)
				}
			];
}

function renderAsObjcServer(root) {
	throw new Error("not implemented java/server");
}

function renderAsObjcClient(root) {
	crossOutOverridedInterfaces(root);
	return [
				{
					"UMWebClient.h": swig.renderFile(__dirname + "/templates/objc/client/UMWebClient.h", root),
					"UMWebClient.m": swig.renderFile(__dirname + "/templates/objc/client/UMWebClient.m", root)
				}
			];
}

function crossOutOverridedInterfaces(root) {
	var existingInterfaces = {};
	var dupilcatedItems = [];
	root.versions.forEach(function(version) {
				version.interfaces.forEach(function(interface) {
						if (existingInterfaces[interface.name]) {
							dupilcatedItems.push({version:version.name, interface:interface.name});
						}
						else {
							existingInterfaces[interface.name] = true;
						}
					});
			});

	dupilcatedItems.forEach(function(item) {
				var stop = false;
				for(var idx = 0; idx < root.versions.length; ++idx) {
					if (stop) {
						break;
					}

					var version = root.versions[idx];
					if (version.name == item.version) {
						for (var subIdx = 0; subIdx < version.interfaces.length; ++subIdx) {
							var interface = version.interfaces[subIdx];
							if (interface.name == item.interface) {
								version.interfaces.splice(subIdx, 1);
								stop = true;
								break;
							}
						}
					}
				}
			});
}
