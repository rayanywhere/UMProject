var Tree = {
	init:function() {
		NotificationCenter.addObserver(Tree);
		$$("tree").attachEvent("onSelectChange", function() {
			NotificationCenter.post(Notification.TREE_EVENT_SELECT_CHANGED, $$("tree").getSelectedItem());
		});
		$$("tree").attachEvent("onBeforeDrag", function(ctx, evt) {
			return ($$("tree").getItem(ctx.source).$level != 3);
		});
		$$("tree").attachEvent("onBeforeDrop", function(ctx, evt) {
			var sourceLevel = $$("tree").getItem(ctx.source).$level;
			var targetLevel = $$("tree").getItem(ctx.target).$level;
			if (sourceLevel != targetLevel) {
				return false;
			}
			if (sourceLevel == 1) {
				return true;
			}

			return ($$("tree").getItem(ctx.source).$parent == $$("tree").getItem(ctx.target).$parent);
		});
		$$("tree").attachEvent("onAfterDrop", function(ctx, evt) {
			var level = $$("tree").getItem(ctx.source).$level;
			if (level == 1) {
				Data.exchangeNamespace($$("tree").getItem(ctx.source).value, $$("tree").getItem(ctx.target).value);
			}
			else if (level == 2) {
				var namespace = Data.findNamespace($$("tree").getItem($$("tree").getItem(ctx.source).$parent).value);
				Data.exchangeObject(namespace, $$("tree").getItem(ctx.source).value, $$("tree").getItem(ctx.target).value);
			}
			else if (level == 4) {
				var node = $$("tree").getItem(ctx.source);
				node = $$("tree").getItem(node.$parent);
				node = $$("tree").getItem(node.$parent);
				var namespace = Data.findNamespace($$("tree").getItem(node.$parent).value);
				var object = Data.findObject(namespace, node.value);

				if ($$("tree").getItem($$("tree").getItem(ctx.source).$parent).value == "Constants") {
					Data.exchangeConstant(object, $$("tree").getItem(ctx.source).value, $$("tree").getItem(ctx.target).value);
				}
				else {
					Data.exchangeAttribute(object, $$("tree").getItem(ctx.source).value, $$("tree").getItem(ctx.target).value);
				}
			}
		});

		webix.event($$("tree").$view, "dragenter", function(e) {e.stopPropagation(); e.preventDefault();});
		webix.event($$("tree").$view, "dragover", function(e) {e.stopPropagation(); e.preventDefault();});
		webix.event($$("tree").$view, "drop", function(e) {e.stopPropagation(); e.preventDefault(); 
			Data.upload(e.dataTransfer.files[0])});

		$$("tree_popup").attachEvent("onItemClick", function(id) {
			Tree._onItemDelete(this.getContext().id);
		});
	},
	_onItemDelete: function(itemId) {
		itemId = itemId.replace(/^tree_/, "");
		if (itemId.length > 0) {
			var components = itemId.split(".");
			switch(components.length) {
				case 1:
					Data.removeNamespace(components[0]);
					break;
				case 2:
					Data.removeObject(components[0], components[1]);
					break;
				case 4:
					if (components[2].toLowerCase() == "constant") {
						Data.removeConstant(components[0], components[1], components[3]);
					}
					else if (components[2].toLowerCase() == "attribute") {
						Data.removeAttribute(components[0], components[1], components[3]);
					}
					break;
			}
		}
	},
	onDataEventReset:function() {
		$$("tree").clearAll();
	},
	onDataEventNamespaceAdded:function(namespace) {
		$$("tree").add({value:namespace.name, icon:"namespace", id:"tree_" + namespace.name}, -1);
	},
	onDataEventNamespaceRemoved:function(namespace) {
		$$("tree").remove("tree_" + namespace.name);
	},
	onDataEventObjectAdded:function(info) {
		var item = $$("tree").getItem("tree_" + info.namespace.name);
		if (item) {
			var objectNodeId = $$("tree").add({id:"tree_" + info.namespace.name + "." + info.object.name, value:info.object.name, icon:"object"}, -1, item.id);
			$$("tree").add({id:"tree_" + info.namespace.name + "." + info.object.name + ".constants", value:"Constants", icon:"constant"}, -1, objectNodeId);
			$$("tree").add({id:"tree_" + info.namespace.name + "." + info.object.name + ".attributes", value:"Attributes", icon:"attribute"}, -1, objectNodeId);
			$$("tree").open(item.id);
		}
	},
	onDataEventObjectRemoved:function(info) {
		$$("tree").remove("tree_" + info.namespace.name + "." + info.object.name);
	},
	onDataEventConstantAdded:function(info) {
		var item = $$("tree").getItem("tree_" + info.namespace.name + "." + info.object.name + ".constants");
		if (item) {
			$$("tree").add({id:"tree_" + info.namespace.name + "." + info.object.name + ".constant." + info.constant.name, value:info.constant.name, icon:info.constant.type.toLowerCase()}, -1, item.id);
			$$("tree").open(item.id);
		}
	},
	onDataEventConstantRemoved:function(info) {
		$$("tree").remove("tree_" + info.namespace.name + "." + info.object.name + ".constant." + info.constant.name);
	},
	onDataEventAttributeAdded:function(info) {
		var item = $$("tree").getItem("tree_" + info.namespace.name + "." + info.object.name + ".attributes");
		if (item) {
			$$("tree").add({id:"tree_" + info.namespace.name + "." + info.object.name + ".attribute." + info.attribute.name, value:info.attribute.name, icon:info.attribute.type.toLowerCase()}, -1, item.id);
			$$("tree").open(item.id);
		}
	},
	onDataEventAttributeRemoved:function(info) {
		$$("tree").remove("tree_" + info.namespace.name + "." + info.object.name + ".attribute." + info.attribute.name);
	},
	getSelectedNamespace: function() {
		var item = $$("tree").getSelectedItem();
		if (item) {
			var level = item.$level;
			while(level > 1) {
				item = $$("tree").getItem(item.$parent);
				--level;
			}
			return Data.findNamespace(item.value);
		}
		return false;
	},
	getSelectedObject: function() {
		var item = $$("tree").getSelectedItem();
		if (item && (item.$level > 1)) {
			var level = item.$level;
			while(level > 2) {
				item = $$("tree").getItem(item.$parent);
				--level;
			}

			var namespace = Tree.getSelectedNamespace();
			return Data.findObject(namespace, item.value);
		}
		return false;
	}
}