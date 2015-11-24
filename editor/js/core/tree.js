var Tree = {
	root:false,
	init: function() {
		Tree.root = $("#tree");
		NotificationCenter.addObserver(Tree);

		Tree.root.find(">.droppable").droppable({accept:"#editor .widget.namespace", hoverClass: "ui-state-highlight", drop: function(event, ui) { 
				Data.addNamespace(); 
			}});
		Tree.root.find(">.droppable").accordion({heightStyle: "fill", collapsible: true});
	},
	toggleDisplay:function(selfDiv, nodeDiv) {
		if (selfDiv.hasClass("ui-icon-triangle-1-e")) {
			selfDiv.removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
			nodeDiv.find(">ul").show();
		}
		else {
			selfDiv.removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
			nodeDiv.find(">ul").hide();
		}
	},
	onEventUiRemove:function(target) {
		if (target.parents("#tree").length > 0) {
			if (target.hasClass("namespace")) {
				Data.removeNamespace(target.next().text());
			}
			else if (target.hasClass("object")) {
				Data.removeObject(target.parent().parent().parent().parent().prev().find("span:last").text(), target.next().text());
			}
			else if (target.hasClass("constant")) {
				Data.removeConstant(target.parent().parent().parent().parent().parent().parent().parent().prev().find("span:last").text(), target.parent().parent().parent().parent().prev().find("span:last").text(), target.next().text());
			}
			else if (target.hasClass("attribute")) {
				Data.removeAttribute(target.parent().parent().parent().parent().parent().parent().parent().prev().find("span:last").text(), target.parent().parent().parent().parent().prev().find("span:last").text(), target.next().text());
			}
			else if (target.hasClass("data")) {
				Data.load([]);
			}
		}
	},
	onEventNamespaceAdded:function(namespace) {
		var tpl = $("#tree_namespace_template").clone();
		tpl.find(".draggable").draggable({revert:true, revertDuration:0, helper:"clone"});
		tpl.find(">h3>span").text(namespace.name).attr("title", namespace.comment);
		tpl.find(">div>ul.droppable").attr("id", "tree_" + namespace.name).droppable({accept:"#editor .widget.object", hoverClass: "ui-state-highlight", drop: function(event, ui) { 
				Data.addObject(namespace); 
			}});
		
		Tree.root.find(">.droppable").removeClass("empty").append(tpl.children()).accordion("refresh");
	},
	onEventObjectAdded:function(info) {
		var tpl = $("#tree_object_template").clone();
		tpl.find(".draggable").draggable({revert:true, revertDuration:0, helper:"clone"});
		tpl.find(">li> div span").text(info.object.name).attr("title", info.object.comment);
		tpl.find(">li> ul").attr("id", "tree_" + info.namespace.name + "_" + info.object.name);
		tpl.find(">li> ul li.constants").droppable({accept:"#editor .widget.constant", hoverClass: "ui-state-highlight", drop: function(event, ui) { 
				Data.addConstant(info.namespace, info.object);
			}});
		tpl.find(">li> ul li.attributes").droppable({accept:"#editor .widget.attribute", hoverClass: "ui-state-highlight", drop: function(event, ui) {
				Data.addAttribute(info.namespace, info.object);
			}});

		$("#tree_" + info.namespace.name).removeClass("empty").append(tpl.children());
	},
	onEventConstantAdded:function(info) {
		var tpl = $("#tree_constant_template").clone();
		tpl.find(".draggable").draggable({revert:true, revertDuration:0, helper:"clone"});
		tpl.find(">li").attr("id", "tree_" + info.namespace.name + "_" + info.object.name + "_constants_" + info.constant.name);
		tpl.find(">li span").text(info.constant.name).attr("title", info.constant.comment);

		$("#tree_" + info.namespace.name + "_" + info.object.name + " > li.droppable.constants > ul").append(tpl.children());
	},
	onEventAttributeAdded:function(info) {
		var tpl = $("#tree_attribute_template").clone();
		tpl.find(".draggable").draggable({revert:true, revertDuration:0, helper:"clone"});
		tpl.find(">li").attr("id", "tree_" + info.namespace.name + "_" + info.object.name + "_attributes_" + info.attribute.name);
		tpl.find(">li span").text(info.attribute.name).attr("title", info.attribute.comment);

		$("#tree_" + info.namespace.name + "_" + info.object.name + " > li.droppable.attributes > ul").append(tpl.children());
	},
	onEventNamespaceRemoved:function(namespace) {
		$("#tree_" + namespace.name).parent().prev().remove();
		$("#tree_" + namespace.name).parent().remove();
		Tree.root.find(">.droppable").accordion("refresh");
		if (Tree.root.find(">.droppable > h3").length == 0) {
			Tree.root.find(">.droppable").addClass("empty");
		}
	},
	onEventObjectRemoved:function(info) {
		var list = $("#tree_" + info.namespace.name + "_" + info.object.name).parent().parent();
		$("#tree_" + info.namespace.name + "_" + info.object.name).parent().remove();
		if (list.find("li").length == 0) {
			list.addClass("empty");
		}
	},
	onEventConstantRemoved:function(info) {
		$("#tree_" + info.namespace.name + "_" + info.object.name + "_constants_" + info.constant.name).remove();
	},
	onEventAttributeRemoved:function(info) {
		$("#tree_" + info.namespace.name + "_" + info.object.name + "_attributes_" + info.attribute.name).remove();
	},
	onEventReset:function() {
		Tree.root.find(">.droppable > *").remove();
		Tree.root.find(">.droppable").addClass("empty");
	}
};
