var Editor = {
	init: function() {
		NotificationCenter.addObserver(Editor);
		Editor.Version.init();
		Editor.Interface.init();
	},
	Version: {
		init: function() {
			NotificationCenter.addObserver(Editor.Version);
			$$("editor_version_button").attachEvent("onItemClick", Editor.Version._onSubmit);
		},
		_onSubmit:function() {
			var version = new UMWeb.Version($$("editor_version_name").getValue(), $$("editor_version_comment").getValue(), []);
			if (!version.name || (version.name.length == 0)) {
				webix.message("name field cannot be empty");
				return;
			}

			if (WebData.findVersion(version.name)) {
				webix.message("duplicated version");
				return;
			}
			WebData.addVersion(version);
		}
	},
	Interface: {
		init: function() {
			NotificationCenter.addObserver(Editor.Interface);
			$$("editor_interface_button").attachEvent("onItemClick", Editor.Interface._onSubmit);
			webix.DragControl.addDrop($$("editor_interface_request").$view,{
			        $drop:function(source, target, context){
			         	var dnd = webix.DragControl.getContext();
			         	var components = dnd.source[0].replace(/^modeltree_/, "").split(".");
			         	if (components.length == 2) {
			         		$$("editor_interface_request").setValue(components[0] + "." + components[1]);
			         	}
			        }
			});
			webix.DragControl.addDrop($$("editor_interface_response").$view,{
			        $drop:function(source, target, context){
			         	var dnd = webix.DragControl.getContext();
			         	var components = dnd.source[0].replace(/^modeltree_/, "").split(".");
			         	if (components.length == 2) {
			         		$$("editor_interface_response").setValue(components[0] + "." + components[1]);
			         	}
			        }
			});
		},
		_onSubmit:function() {
			var interface = new UMWeb.Interface($$("editor_interface_name").getValue(), $$("editor_interface_comment").getValue(), $$("editor_interface_protocol").getValue(), $$("editor_interface_host").getValue(), parseInt($$("editor_interface_port").getValue()) || 80, parseInt($$("editor_interface_timeout")) || 0, null, null);
			if (!interface.name || (interface.name.length == 0)) {
				webix.message("name field cannot be empty");
				return;
			}
			if (interface.host.length == 0) {
				webix.message("host field cannot be empty");
				return;
			}

			var components = $$("editor_interface_request").getValue().split(".");
			if (components.length != 2) {
				webix.message("request cannot be empty");
				return;
			}
			interface.request = {namespace: components[0], object:components[1]};

			components = $$("editor_interface_response").getValue().split(".");
			if (components.length != 2) {
				webix.message("response cannot be empty");
				return;
			}
			interface.response = {namespace:components[0], object:components[1]};


			var version = WebTree.getSelectedVersion();
			if (!version || WebData.findInterface(version, interface.name)) {
				webix.message("duplicated interface");
				return;
			}
			WebData.addInterface(version, interface);
		},
		onWebTreeEventSelectChanged:function(node) {
			(node.$level == 1) ? $$("editor_interface_button").enable() : $$("editor_interface_button").disable();
		}
	}
};