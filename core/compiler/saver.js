var fs = require("fs");
var child_process = require("child_process");

exports.save = function(results, targetFolder) {
	fs.mkdirSync(targetFolder);
	results.forEach(function(element) {
				for(var filename in element) {
					fs.writeFileSync(targetFolder + "/" + filename, element[filename], 'utf8');
				};
			});
};
