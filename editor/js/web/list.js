var List = {
	root:false,
	init: function() {
		NotificationCenter.addObserver(List);
		List.root = $("#list");

		List.root.find(">div.droppable").droppable({accept:"#editor > h1 > .draggable.version", hoverClass:"ui-state-highlight", drop: function(ui, evt){
					WebData.addVersion();
				}});
		List.root.find(">div.droppable").accordion({heightStyle: "fill", collapsible: true});
	},
	onEventWebVersionAdded:function(version) {
		var tpl = $("#list_version_template").clone();
		tpl.find(">h3 span").text(version.name).attr("title", version.comment);
		tpl.find(">div > ul").attr("id", "list_" + version.name).droppable({accept:"#editor > h1 > .draggable.interface", hoverClass:"ui-state-highlight", drop:function(ui, evt){
					WebData.addInterface(version);
				}});
		
		List.root.find(">div.droppable").removeClass("empty").prepend(tpl.children());
		List.root.find(">div.droppable").accordion("refresh");
	},
	onEventWebInterfaceAdded:function(info) {
		var tpl = $("#list_interface_template").clone();

		tpl.find(">li span").text(info.interface.name).attr("title", info.interface.comment);
		tpl.find(">li").attr("id", "list_" + info.version.name + "_" + info.interface.name);

		List.root.find("#list_" + info.version.name).removeClass("empty").prepend(tpl.children());
	},
	onEventWebReset:function() {
		List.root.find(">div.droppable > *").remove();
	}
};
