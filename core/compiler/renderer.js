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
					"UModel.php": swig.renderFile(__dirname + "/templates/php/UModel.php", root)
				}
			];
}

function renderAsJava(root) {
	return [
				{
					"UModel.java": swig.renderFile(__dirname + "/templates/java/UModel.java", root)
				}
			];
}

function renderAsObjc(root) {
	return [
				{
					"UModel.h": swig.renderFile(__dirname + "/templates/objc/UModel.h", root),
					"UModel.m": swig.renderFile(__dirname + "/templates/objc/UModel.m", root)
				}
			];
}
