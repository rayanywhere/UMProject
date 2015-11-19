var parser = require("./parser.js");
var renderer = require("./renderer.js");
var saver = require("./saver.js");

if (process.argv.length < 6) {
	console.error("usage: node " + process.argv[0] + " <UM.Core.json> <UM.WebBridge.json> <target:language/side> <folder>");
	process.exit(1);
}

var coreFile = process.argv[2];
var webBridgeFile = process.argv[3];
var target = process.argv[4];
var folder = process.argv[5];

parser.parse(coreFile, webBridgeFile, function(err, json) {
	if (err) {
		console.error(err.stack);
		process.exit(2);
		return;
	}

	var results = renderer.render(json, target);
	saver.save(results, folder);
});
