var TreePath = function(node) {
	this.pathStr = "";
	this.pathArr = [];
	this.type = false;

	if (node.hasClass("namespace")) {
		this.type = "NAMESPACE";
		this.pathStr = node.text();
		this.pathArr = [this.pathStr];
	}
	else if (node.hasClass("object")) {
		this.type = "OBJECT";
		this.pathStr = node.parent().parent().parent().prev().text() + "." + node.find("div.name").text();
		this.pathArr = [node.parent().parent().parent().prev().text(), node.find("div.name").text()];
	}
	else if (node.hasClass("constant")) {
		this.type = "CONSTANT";
		this.pathStr = node.parent().parent().parent().parent().parent().parent().parent().prev().text() + "." + node.parent().parent().parent().parent().parent().find("> div.item div.name").text() + "." + node.find("div.name").text();
		this.pathArr = [node.parent().parent().parent().parent().parent().parent().parent().prev().text(), node.parent().parent().parent().parent().parent().find("> div.item div.name").text(), node.find("div.name").text()];
	}
	else if (node.hasClass("attribute")) {
		this.type = "ATTRIBUTE";
		this.pathStr = node.parent().parent().parent().parent().parent().parent().parent().prev().text() + "." + node.parent().parent().parent().parent().parent().find("> div.item div.name").text() + "." + node.find("div.name").text();
		this.pathArr = [node.parent().parent().parent().parent().parent().parent().parent().prev().text(), node.parent().parent().parent().parent().parent().find("> div.item div.name").text(), node.find("div.name").text()];
	}
};

var TreeMgr = {
	init: function() {
		NotificationCenter.addObserver(TreeMgr);

		$("#tree > .default,#tree > .namespaces").droppable({
					accept: function(draggable) {
						return ($("#editor > h1  .widget.draggable").is(draggable) && $("#editor > div.namespace").is(':visible'));
					},
					hoverClass: "ui-state-highlight",
					drop: function(event, ui) {
						DataMgr.addNamespace();
					}
				});

		$("#tree > .namespaces").accordion({
					heightStyle: "fill",
					collapsible: true
				});
	},
	select:function(target, event){
		$("#tree > .namespaces ul li > div.item").removeClass("ui-state-highlight");
		if (target) {
			target.addClass("ui-state-highlight");
		}
		if (event && event.stopPropagation) {
			event.stopPropagation();
		}
		return false;
	},
	onEventDataReset:function() {
		$("#tree > .namespaces > h3:not(.template)").remove();
		$("#tree > .namespaces > div:not(.template)").remove();
		$("#tree > .namespaces").accordion("refresh");
		TreeMgr._show("default");
	},
	onEventDataNamespaceAdded:function(namespace) {
		TreeMgr._show("namespaces");
		var titleDiv = $("#tree > .namespaces > h3.template").clone().removeClass("template").text(namespace.name);
		titleDiv.draggable({revert:true, revertDuration:0, helper:"clone"});

		var dataDiv = $("#tree > .namespaces > div.template").clone().removeClass("template").attr("id", "tree_" + namespace.name);
		dataDiv.droppable({
			accept: function(draggable) {
				return ($("#editor > h1 .widget.draggable").is(draggable) && $("#editor > div.object").is(':visible'));
			},
			hoverClass: "ui-state-highlight",
			drop: function(event, ui) {
				DataMgr.addObject(namespace);
			}
		});

		$("#tree > .namespaces").append(titleDiv).append(dataDiv);
		$("#tree > .namespaces").accordion("refresh");
	},
	onEventDataNamespaceRemoved:function(namespace) {
		$("#tree_" + namespace.name).prev().remove();
		$("#tree_" + namespace.name).remove();
		$("#tree > .namespaces").accordion("refresh");
		if (!$("#tree > .namespaces > div:not(.template)").is(":visible")) {
			TreeMgr._show("default");
		}
	},
	onEventDataObjectAdded:function(info) {
		var namespace = info.namespace;
		var object = info.object;

		var objectTemplate = $("#tree_" + namespace.name + " > ul li.template.object").clone().removeClass("template").attr("id", "tree_" + namespace.name + "_object_" + object.name);
		objectTemplate.find(" > div.item > div.name").text(object.name).attr("title",object.comment);
		objectTemplate.find(" > div.item").draggable({revert:true, revertDuration:0, helper:"clone"});
		objectTemplate.find(" > ul.children > li.constants").droppable({
					accept: function(draggable) {
						return ($("#editor > h1 .widget.draggable").is(draggable) && $("#editor > div.constant").is(':visible'));
					},
					hoverClass: "ui-state-highlight",
					drop: function(event, ui) {
						DataMgr.addConstant(namespace, object);
					}
				});
		objectTemplate.find(" > ul.children > li.attributes").droppable({
					accept: function(draggable) {
						return ($("#editor > h1 .widget.draggable").is(draggable) && $("#editor > div.attribute").is(':visible'));
					},
					hoverClass: "ui-state-highlight",
					drop: function(event, ui) {
						DataMgr.addAttribute(namespace, object);
					}
				});

		$("#tree_" + namespace.name + " > ul").append(objectTemplate);
	},
	onEventDataObjectRemoved:function(info) {
		var namespace = info.namespace;
		var object = info.object;

		$("#tree_" + namespace.name + "_object_" + object.name).remove();
	},
	onEventDataConstantAdded:function(info) {
		var namespace = info.namespace;
		var object = info.object;
		var constant = info.constant;

		var constantTemplate = $("#tree_" + namespace.name + "_object_" + object.name + " > ul.children > li.constants > ul > li.template.constant").clone().removeClass("template").attr("id", "tree_" + namespace.name + "_object_" + object.name + "_constant_" + constant.name);
		constantTemplate.find(" > div.item").draggable({revert:true, revertDuration:0, helper:"clone"});
		constantTemplate.find(" > div.item > div.widget.draggable").addClass("icon-" + constant.type.toLowerCase());
		constantTemplate.find(" > div.item > div.name").text(constant.name).attr("title", constant.comment);
		$("#tree_" + namespace.name + "_object_" + object.name + " > ul.children > li.constants > ul").append(constantTemplate);
	},
	onEventDataConstantRemoved:function(info) {
		var namespace = info.namespace;
		var object = info.object;
		var constant = info.constant;

		$("#tree_" + namespace.name + "_object_" + object.name + "_constant_" + constant.name).remove();
	},
	onEventDataAttributeAdded:function(info) {
		var namespace = info.namespace;
		var object = info.object;
		var attribute = info.attribute;
		
		var attributeTemplate = $("#tree_" + namespace.name + "_object_" + object.name + " > ul.children > li.attributes > ul > li.template.attribute").clone().removeClass("template").attr("id", "tree_" + namespace.name + "_object_" + object.name + "_attribute_" + attribute.name);
		attributeTemplate.find(" > div.item").draggable({revert:true, revertDuration:0, helper:"clone"});
		attributeTemplate.find(" > div.item > div.widget.draggable").addClass("icon-" + attribute.type.toLowerCase());
		attributeTemplate.find(" > div.item > div.name").text(attribute.name).attr("title", attribute.comment);
		$("#tree_" + namespace.name + "_object_" + object.name + " > ul.children > li.attributes > ul").append(attributeTemplate);
	},
	onEventDataAttributeRemoved:function(info) {
		var namespace = info.namespace;
		var object = info.object;
		var attribute = info.attribute;

		$("#tree_" + namespace.name + "_object_" + object.name + "_attribute_" + attribute.name).remove();
	},
	toggleItemDisplay:function(item) {
		if (item.find(" > ul").is(":visible")) {
			item.find(" > div.item .ui-icon").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
			item.find(" > ul").hide();
		}
		else {
			item.find(" > div.item .ui-icon").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
			item.find(" > ul").show();
		}
	},
	_show: function(target) {
		$("#tree > div").hide();
		$("#tree > div." + target).show();
	}
};
