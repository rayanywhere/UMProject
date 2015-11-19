var swig  = require("swig");

exports.render = function(json, language) {
	var root = {namespaces:json};
	swig.setFilter("ucfirst", function(input) {
				return input.charAt(0).toUpperCase() + input.slice(1);
			});
	swig.setFilter("um_attribute_is", function(attribute, typeName) {
				return (attribute.type == typeName);
			});
	swig.setFilter("um_filter_is", function(filter, typeName) {
				return (typeof(filter) == typeName);
			});
	swig.setFilter("um_value_is", function(value, typeName) {
				return (typeof(value) == typeName);
			});
	swig.setFilter("um_constant_is", function(constant, typeName) {
				return (constant.type == typeName);
			});
	switch(language) {
		case "php":
			return renderAsPHP(root);
			break;
		case "objc":
			return renderAsObjc(root);
			break;
		case "java":
			return renderAsJava(root);
			break;
		default:
			throw new Error("unknown language(" + language + ")");
			break;
	}
};

function renderAsPHP(root) {
	return [
				{
					"UMCore.php": swig.renderFile(__dirname + "/templates/php/UMCore.php", root)
				}
			];
}

function renderAsJava(root) {
	return [
				{
					"UMCore.java": swig.renderFile(__dirname + "/templates/java/UMCore.java", root)
				}
			];
}

function renderAsObjc(root) {
	return [
				{
					"UMCore.h": swig.renderFile(__dirname + "/templates/objc/UMCore.h", root),
					"UMCore.m": swig.renderFile(__dirname + "/templates/objc/UMCore.m", root)
				}
			];
}
