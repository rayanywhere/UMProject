var ModelTree = {
	init:function() {
		NotificationCenter.addObserver(ModelTree);
		$$("modeltree").attachEvent("onBeforeDrag", function(ctx, evt) {
			return ($$("modeltree").getItem(ctx.source).$level == 2);
		});
		
		webix.event($$("modeltree").$view, "dragenter", function(e) {e.stopPropagation(); e.preventDefault();});
		webix.event($$("modeltree").$view, "dragover", function(e) {e.stopPropagation(); e.preventDefault();});
		webix.event($$("modeltree").$view, "drop", function(e) {e.stopPropagation(); e.preventDefault(); 
			Data.upload(e.dataTransfer.files[0])});
	},
	onDataEventReset:function() {
		$$("modeltree").clearAll();
	},
	onDataEventNamespaceAdded:function(namespace) {
		$$("modeltree").add({value:namespace.name, icon:"namespace", id:"modeltree_" + namespace.name}, -1);
	},
	onDataEventNamespaceRemoved:function(namespace) {
		$$("modeltree").remove("modeltree_" + namespace.name);
	},
	onDataEventObjectAdded:function(info) {
		var item = $$("modeltree").getItem("modeltree_" + info.namespace.name);
		if (item) {
			var objectNodeId = $$("modeltree").add({id:"modeltree_" + info.namespace.name + "." + info.object.name, value:info.object.name, icon:"object"}, -1, item.id);
			$$("modeltree").add({id:"modeltree_" + info.namespace.name + "." + info.object.name + ".constants", value:"Constants", icon:"constant"}, -1, objectNodeId);
			$$("modeltree").add({id:"modeltree_" + info.namespace.name + "." + info.object.name + ".attributes", value:"Attributes", icon:"attribute"}, -1, objectNodeId);
			$$("modeltree").open(item.id);
		}
	},
	onDataEventObjectRemoved:function(info) {
		$$("modeltree").remove("modeltree_" + info.namespace.name + "." + info.object.name);
	},
	onDataEventConstantAdded:function(info) {
		var item = $$("modeltree").getItem("modeltree_" + info.namespace.name + "." + info.object.name + ".constants");
		if (item) {
			$$("modeltree").add({id:"modeltree_" + info.namespace.name + "." + info.object.name + ".constant." + info.constant.name, value:info.constant.name, icon:info.constant.type.toLowerCase()}, -1, item.id);
			$$("modeltree").open(item.id);
		}
	},
	onDataEventConstantRemoved:function(info) {
		$$("modeltree").remove("modeltree_" + info.namespace.name + "." + info.object.name + ".constant." + info.constant.name);
	},
	onDataEventAttributeAdded:function(info) {
		var item = $$("modeltree").getItem("modeltree_" + info.namespace.name + "." + info.object.name + ".attributes");
		if (item) {
			$$("modeltree").add({id:"modeltree_" + info.namespace.name + "." + info.object.name + ".attribute." + info.attribute.name, value:info.attribute.name, icon:info.attribute.type.toLowerCase()}, -1, item.id);
			$$("modeltree").open(item.id);
		}
	},
	onDataEventAttributeRemoved:function(info) {
		$$("modeltree").remove("modeltree_" + info.namespace.name + "." + info.object.name + ".attribute." + info.attribute.name);
	}
};

var WebTree = {
	init:function() {
		NotificationCenter.addObserver(WebTree);
		$$("webtree").attachEvent("onSelectChange", function() {
			NotificationCenter.post(Notification.WEB_TREE_EVENT_SELECT_CHANGED, $$("webtree").getSelectedItem());
		});

		$$("webtree").attachEvent("onBeforeDrop", function(ctx, evt) {
			var sourceLevel = $$("webtree").getItem(ctx.source).$level;
			var targetLevel = $$("webtree").getItem(ctx.target).$level;
			if (sourceLevel != targetLevel) {
				return false;
			}
			return ($$("webtree").getItem(ctx.source).$parent == $$("webtree").getItem(ctx.target).$parent);
		});
		$$("webtree").attachEvent("onAfterDrop", function(ctx, evt) {
			var level = $$("webtree").getItem(ctx.source).$level;
			if (level == 1) {
				WebData.exchangeVersion($$("webtree").getItem(ctx.source).value, $$("webtree").getItem(ctx.target).value);
			}
			else if (level == 2) {
				var version = WebData.findVersion($$("webtree").getItem($$("webtree").getItem(ctx.source).$parent).value);
				WebData.exchangeInterface(version, $$("webtree").getItem(ctx.source).value, $$("webtree").getItem(ctx.target).value);
			}
		});
		
		webix.event($$("webtree").$view, "dragenter", function(e) {e.stopPropagation(); e.preventDefault();});
		webix.event($$("webtree").$view, "dragover", function(e) {e.stopPropagation(); e.preventDefault();});
		webix.event($$("webtree").$view, "drop", function(e) {e.stopPropagation(); e.preventDefault(); 
			WebData.upload(e.dataTransfer.files[0])});

		$$("webtree_popup").attachEvent("onItemClick", function(id) {
			WebTree._onItemDelete(this.getContext().id);
		});
	},
	onWebDataEventReset:function() {
		$$("webtree").clearAll();
	},
	onWebDataEventVersionAdded:function(version) {
		$$("webtree").add({value:version.name, icon:"version", id:"webtree_" + version.name}, -1);
	},
	onWebDataEventVersionRemoved:function(version) {
		$$("webtree").remove("webtree_" + version.name);
	},
	onWebDataEventInterfaceAdded:function(info) {
		var item = $$("webtree").getItem("webtree_" + info.version.name);
		if (item) {
			var objectNodeId = $$("webtree").add({id:"webtree_" + info.version.name + "." + info.interface.name, value:info.interface.name, icon:"interface"}, -1, item.id);
			$$("webtree").open(item.id);
		}
	},
	onWebDataEventInterfaceRemoved:function(info) {
		$$("webtree").remove("webtree_" + info.version.name + "." + info.interface.name);
	},
	_onItemDelete: function(itemId) {
		itemId = itemId.replace(/^webtree_/, "");
		if (itemId.length > 0) {
			var components = itemId.split(".");
			switch(components.length) {
				case 1:
					WebData.removeVersion(components[0]);
					break;
				case 2:
					WebData.removeInterface(components[0], components[1]);
					break;
			}
		}
	},
	getSelectedVersion: function() {
		var item = $$("webtree").getSelectedItem();
		if (item) {
			var level = item.$level;
			while(level > 1) {
				item = $$("webtree").getItem(item.$parent);
				--level;
			}
			return WebData.findVersion(item.value);
		}
		return false;
	}
}