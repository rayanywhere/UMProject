var ToolbarMgr = {
	init:function() {
		NotificationCenter.addObserver(ToolbarMgr);
		$("#toolbar .widget.trash").droppable({
					hoverClass: "ui-state-highlight",
					drop: function(event, ui) {
						if (!ui.draggable.hasClass("widget")) {
							return;
						}

						if (ui.draggable.hasClass("editor")) {
							EditorMgr.show("default");
						}
						else if (ui.draggable.hasClass("tree")) {
							var treePath = new TreePath(ui.draggable);
							switch (treePath.type) {
								case "NAMESPACE":
									DataMgr.removeNamespace(treePath.pathArr[0]);
									break;
								case "OBJECT":
									DataMgr.removeObject(treePath.pathArr[0], treePath.pathArr[1]);
									break;
								case "CONSTANT":
									DataMgr.removeConstant(treePath.pathArr[0], treePath.pathArr[1], treePath.pathArr[2]);
									break;
								case "ATTRIBUTE":
									DataMgr.removeAttribute(treePath.pathArr[0], treePath.pathArr[1], treePath.pathArr[2]);
									break;
							}
						}
					}
				});
	},
	_updateDisabledWidgets:function(widgets) {
		$("#toolbar .widget").removeClass("ui-state-disabled");
		widgets.forEach(function(name) {
					$("#toolbar .widget." + name).addClass("ui-state-disabled");
				});
	},
	onEventEditorSwitched:function(editor) {
		if (editor.hasClass("namespace") 
				|| editor.hasClass("object")
				|| editor.hasClass("constant")
				|| editor.hasClass("attribute")) {
			ToolbarMgr._updateDisabledWidgets(["namespace", "object", "constant", "attribute"]);
		}
		else {
			ToolbarMgr._updateDisabledWidgets([]);
		}
	},
	onEventDataReset:function() {
		ToolbarMgr._updateDisabledWidgets([]);
	}
};
