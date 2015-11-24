var UMWeb = {
	Version: function(name, comment, interfaces) {
		this.name = name;
		this.comment = comment;
		this.interfaces = interfaces;
	},
	Interface : function(name, comment, protocol, host, port, timeout, request, response) {
		this.name = name;
		this.comment = comment;
		this.protocol = protocol;
		this.host = host;
		this.port = port;
		this.timeout = timeout;
		this.request = request;
		this.response = response;
	}
};

var WebData = {
	_versions:[],
	init:function() {
		NotificationCenter.addObserver(Data);
	},
	download:function() {
		var blob = new Blob([JSON.stringify(WebData._versions, null, 2)], {type: "text/json;charset=utf-8"});
	 	saveAs(blob, "UM.Web.json");
	},
	upload:function(file) {
		var reader = new FileReader();
		reader.onload = function(e) {
			WebData.load(JSON.parse(e.target.result));
		};
		reader.readAsText(file);
	},
	load:function(versions) {
		WebData._versions = [];
		NotificationCenter.post(Notification.EVENT_WEB_RESET);

		versions.forEach(function(item) {
					var version = new UMWeb.Version(item.name, item.comment, []);
					WebData.addVersion(version);

					item.interfaces.forEach(function(item) {
							var interface = new UMWeb.Interface(item.name, item.comment, item.protocol, item.host, item.port, item.timeout, item.request, item.respsonse);
							WebData.addInterface(version, interface);
						});
				});
	},
	findVersion:function(targetName) {
		var targetVersion = false;
		WebData._versions.forEach(function(element) {
					if (element.name == targetName) {
						targetVersion = element;
					}
				});
		return targetVersion;
	},
	findInterface:function(version, targetName) {
		var targetInterface = false;
		version.interfaces.forEach(function(element) {
					if (element.name == targetName) {
						targetInterface = element;
					}
				});
		return targetInterface;
	},
	addVersion:function(version) {
		if (!version) {
			version = Editor.Version.getData();
		}
		if (!version) {
			return;
		}
		for(var idx = 0; idx < WebData._versions.length; ++idx) {
			if (Data._versions[idx].name == version.name) {
				alert("duplicated version");
				return;
			}
		}

		WebData._versions.push(version);
		NotificationCenter.post(Notification.EVENT_WEB_VERSION_ADDED, version);
	},
	removeVersion:function(name) {
		for(var idx = 0; idx < WebData._versions.length; ++idx) {
			if (WebData._versions[idx].name == name) {
				var deleted = WebData._versions.splice(idx, 1);
				NotificationCenter.post(Notification.EVENT_WEB_VERSION_REMOVED, deleted[0]);
				return;
			}
		}
	},
	addInterface:function(version, interface) {
		if (!interface) {
			interface = Editor.Interface.getData();
		}
		if (!interface) {
			return;
		}

		for(var idx = 0; idx < version.interfaces.length; ++idx) {
			if (version.interfaces[idx].name == interface.name) {
				alert("duplicated interface");
				return;
			}
		}

		version.interfaces.push(interface);
		NotificationCenter.post(Notification.EVENT_WEB_INTERFACE_ADDED, {version:version, interface:interface});
	},
	removeInterface:function(nameOfVersion, nameOfInterface) {
		var version = Data.findVersion(nameOfVersion);
		if (version) {
			for(var idx = 0; idx < version.interfaces.length; ++idx) {
				if (version.interfaces[idx].name == nameOfInterface) {
					var deleted = version.interfaces.splice(idx, 1);
					NotificationCenter.post(Notification.EVENT_WBE_INTERFACE_REMOVED, {version:version, interface:deleted[0]});
					return;
				}
			}
		}
	}
}
