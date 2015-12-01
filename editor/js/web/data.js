var UMWeb = {
    Version: function(name, comment, interfaces) {
        this.name = name;
        this.comment = comment;
        this.interfaces = interfaces;
    },
    Interface: function(name, comment, protocol, host, port, timeout, request, response) {
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
        NotificationCenter.addObserver(WebData);
    },
    download:function() {
        webix.confirm({
            title:"Need your confirmation",
            ok:"Go ahead",
            cancel:"No",
            type:"confirm-error",
            text:"Download as UM.Web.json?",
            callback:function(result) {
                if (result) {
                    var blob = new Blob([JSON.stringify(WebData._versions, null, 2)], {type: "text/json;charset=utf-8"});
                    saveAs(blob, "UM.Web.json");
                }
            }
        });
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
        NotificationCenter.post(Notification.WEB_DATA_EVENT_RESET);

        versions.forEach(function(item) {
                    var version = new UMWeb.Version(item.name, item.comment, []);
                    WebData.addVersion(version);

                    item.interfaces.forEach(function(item) {
                            var interface = new UMWeb.Interface(item.name, item.comment, item.protocol, item.host, item.port, item.timeout, item.request, item.response);
                            WebData.addInterface(version, interface);
                        });
                });
    },
    isEmpty:function() {
        return (WebData._versions.length == 0);
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
        for(var idx = 0; idx < WebData._versions.length; ++idx) {
            if (WebData._versions[idx].name == version.name) {
                alert("duplicated version");
                return;
            }
        }

        WebData._versions.push(version);
        NotificationCenter.post(Notification.WEB_DATA_EVENT_VERSION_ADDED, version);
    },
    removeVersion:function(name) {
        for(var idx = 0; idx < WebData._versions.length; ++idx) {
            if (WebData._versions[idx].name == name) {
                var deleted = WebData._versions.splice(idx, 1);
                NotificationCenter.post(Notification.WEB_DATA_EVENT_VERSION_REMOVED, deleted[0]);
                return;
            }
        }
    },
    exchangeVersion:function(nameOfSource, nameOfTarget) {
        var sourceIdx = -1;
        var targetIdx = -1;
        for (var idx = 0; idx < WebData._versions.length; ++idx) {
            if (WebData._versions[idx].name == nameOfSource) {
                sourceIdx = idx;
            }
            if (WebData._versions[idx].name == nameOfTarget) {
                targetIdx = idx;
            }
        }

        if ((targetIdx != -1) && (sourceIdx != -1)) {
            var swap = WebData._versions[sourceIdx];
            WebData._versions[sourceIdx] = WebData._versions[targetIdx];
            WebData._versions[targetIdx] = swap;
            console.log("version exchanged");
        }
    },
    addInterface:function(version, interface) {
        for(var idx = 0; idx < version.interfaces.length; ++idx) {
            if (version.interfaces[idx].name == interface.name) {
                alert("duplicated interface");
                return;
            }
        }

        version.interfaces.push(interface);
        NotificationCenter.post(Notification.WEB_DATA_EVENT_INTERFACE_ADDED, {version:version, interface:interface});
    },
    removeInterface:function(nameOfVersion, nameOfInterface) {
        var version = WebData.findVersion(nameOfVersion);
        if (version) {
            for(var idx = 0; idx < version.interfaces.length; ++idx) {
                if (version.interfaces[idx].name == nameOfInterface) {
                    var deleted = version.interfaces.splice(idx, 1);
                    NotificationCenter.post(Notification.WEB_DATA_EVENT_INTERFACE_REMOVED, {version:version, interface:deleted[0]});
                    return;
                }
            }
        }
    },
    exchangeInterface:function(version, nameOfSource, nameOfTarget) {
        var sourceIdx = -1;
        var targetIdx = -1;
        for (var idx = 0; idx < version.interfaces.length; ++idx) {
            if (version.interfaces[idx].name == nameOfSource) {
                sourceIdx = idx;
            }
            if (version.interfaces[idx].name == nameOfTarget) {
                targetIdx = idx;
            }
        }

        if ((targetIdx != -1) && (sourceIdx != -1)) {
            var swap = version.interfaces[sourceIdx];
            version.interfaces[sourceIdx] = version.interfaces[targetIdx];
            version.interfaces[targetIdx] = swap;
            console.log("interface exchanged");
        }
    }
}
