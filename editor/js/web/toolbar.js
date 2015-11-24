var Toolbar = {
	root:false,
	init:function() {

		NotificationCenter.addObserver(Toolbar);

		Toolbar.root = $("#toolbar");
		Toolbar.root.find(".widget.namespace,.widget.object,.widget.constant,.widget.attribute").draggable({revert:true, revertDuration:0, helper:"clone"});

		Toolbar.root.find(".widget.trash").droppable({accept:"#list .widget", hoverClass:"ui-state-highlight", drop: Toolbar._onRemove});
		Toolbar.root.find(".widget.transfer").droppable({accept:"#list .widget.data", hoverClass:"ui-state-highlight", drop: Toolbar._onSave});

		var emptyHandler = function(evt) {
			evt.stopPropagation();
			evt.preventDefault();
		};
		Toolbar.root.find(".widget.transfer").on("dragenter", emptyHandler)
									.on("dragover", emptyHandler)
									.on("drop", function(evt) {
										if (evt.originalEvent.dataTransfer) {
											emptyHandler(evt);
											Toolbar._onLoad(evt.originalEvent.dataTransfer.files[0]);
										}
									});
		$(document).on("dragenter", emptyHandler).on("dragover", emptyHandler).on("drop", emptyHandler);
	},
	_onSave:function(ui, evt) {
		WebData.download();
	},
	_onLoad:function(file) {
		if (Data.isEmpty()) {
			Data.upload(file);
		}
		else {
			WebData.upload(file);
		}
	},
	_onRemove:function(ui, evt) {
		NotificationCenter.post(Notification.EVENT_UI_REMOVE, evt.draggable);
	},
	_updateDisabledWidgets:function(widgets) {
		Toolbar._root.find(".widget").removeClass("ui-state-disabled");
		widgets.forEach(function(name) {
					Toolbar._root.find(".widget." + name).addClass("ui-state-disabled");
				});
	},
	onEventDataReset:function() {
		ToolbarMgr._updateDisabledWidgets([]);
	}
};
