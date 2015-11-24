var fs = require("fs");
var path = require('path');
var child_process = require("child_process");

exports.save = function(results, targetFolder) {
	fs.mkdirSync(targetFolder);
	results.forEach(function(element) {
				for(var filename in element) {
					var fullFilePathName = targetFolder + "/" + filename;
					var directoryName = path.dirname(fullFilePathName);
					if (!fs.existsSync(directoryName)) {
						fs.mkdirSync(directoryName);
					}
					fs.writeFileSync(fullFilePathName, element[filename], 'utf8');
				};
			});
};
