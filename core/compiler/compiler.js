var parser = require("./parser.js");
var renderer = require("./renderer.js");
var saver = require("./saver.js");

if (process.argv.length < 5) {
	console.error("usage: node " + process.argv[0] + " <UM.Core.json> <language> <target_folder>");
	process.exit(1);
}

var corefile = process.argv[2];
var language = process.argv[3];
var target = process.argv[4];

parser.parse(corefile, function(err, json) {
	if (err) {
		console.error(err.stack);
		process.exit(2);
		return;
	}

	var results = renderer.render(json, language);
	saver.save(results, target);
});
