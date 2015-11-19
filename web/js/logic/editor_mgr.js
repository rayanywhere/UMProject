var EditorMgr = {
	init: function() {
		NotificationCenter.addObserver(EditorMgr);
		EditorMgr.DefaultMgr.init();
		EditorMgr.show("default");
	},
	onEventDataNamespaceAdded: function() {
		EditorMgr.show("default");
	},
	onEventDataObjectAdded: function() {
		EditorMgr.show("default");
	},
	onEventDataConstantAdded: function() {
		EditorMgr.show("default");
	},
	onEventDataAttributeAdded: function() {
		EditorMgr.show("default");
	},
	onEventDataReset: function() {
		EditorMgr.show("default");
	},
	show:function(editorName) {
		$("#editor > div").hide();
		$("#editor ." + editorName).show();

		switch(editorName) {
			case "default":
				$("#editor > h1 > span").text("Editor - Getting Started");
				$("#editor > h1 > .widget").removeClass("namespace");
				$("#editor > h1 > .widget").removeClass("object");
				$("#editor > h1 > .widget").removeClass("constant");
				$("#editor > h1 > .widget").removeClass("attribute");
				break;
			case "namespace":
				$("#editor > h1 > span").text("Editor - Create a namespace");
				$("#editor > h1 > .widget").addClass("namespace");
				EditorMgr.NamespaceMgr.init();
				break;
			case "object":
				$("#editor > h1 > span").text("Editor - Create an object");
				$("#editor > h1 > .widget").addClass("object");
				EditorMgr.ObjectMgr.init();
				break;
			case "constant":
				$("#editor > h1 > span").text("Editor - Create a constant");
				$("#editor > h1 > .widget").addClass("constant");
				EditorMgr.ConstantMgr.init();
				break;
			case "attribute":
				$("#editor > h1 > span").text("Editor - Create a attribute");
				$("#editor > h1 > .widget").addClass("attribute");
				EditorMgr.AttributeMgr.init();
				break;
			default:
				break;
		}

		NotificationCenter.post(Notification.EVENT_EDITOR_SWITCHED, $("#editor ." + editorName));
	},
	DefaultMgr : {
		init: function() {
			$("#editor > div.default").droppable({
						accept: "#toolbar .widget.namespace,#toolbar .widget.object,#toolbar .widget.constant,#toolbar .widget.attribute",
						hoverClass: "ui-state-highlight",
						drop: function(event, ui) {
							switch(ui.draggable.attr("name")) {
								case "namespace":
									EditorMgr.show("namespace");
									break;
								case "object":
									EditorMgr.show("object");
									break;
								case "constant":
									EditorMgr.show("constant");
									break;
								case "attribute":
									EditorMgr.show("attribute");
									break;
							}
						}
					});
		}
	},
	NamespaceMgr : {
		init: function() {
			$("#editor > div.namespace > ul > li.name.data input").val("");
			$("#editor > div.namespace > ul > li.comment.data textarea").val("");
		},
		getData: function() {
			var name = $("#editor > div.namespace > ul > li.name.data input").val();
			var comment = $("#editor > div.namespace > ul > li.comment.data textarea").val();
			if (name.length == 0) {
				alert("name field cannot be left empty");
				return false;
			}

			return new UM.Namespace(name, comment, []);
	    }
	},
	ObjectMgr : {
		init: function() {
			$("#editor > div.object > ul > li.name.data input").val("");
			$("#editor > div.object > ul > li.comment.data textarea").val("");
		},
		getData: function() {
			var name = $("#editor > div.object > ul > li.name.data input").val();
			var comment = $("#editor > div.object > ul > li.comment.data textarea").val();
			if (name.length == 0) {
				alert("name field cannot be left empty");
				return false;
			}
			return new UM.Object(name, comment, [], []);
		}
	},
	ConstantMgr : {
		init: function() {
			$("#editor > div.constant > ul > li.name.data input").val("");
			$("#editor > div.constant > ul > li.comment.data textarea").val("");
			$("#editor > div.constant > ul > li.type.data input:radio").prop("checked", false);
			$("#editor > div.constant > ul > li.value.data input").val("");
			$("#editor > div.constant > ul > li.value.data select").val($("#editor > div.constant > ul > li.value.data select option:first").val());
			EditorMgr.ConstantMgr.onTypeChanged();
		},
		onTypeChanged: function() {
			var targetValueName = false;
			if ($('#editor > div.constant > ul > li.type.data input:radio:checked').length > 0) {
				targetValueName = $('#editor > div.constant > ul > li.type.data input:radio:checked').val().toLowerCase();
			}
			if (!targetValueName) {
				$("#editor > div.constant > ul > li.value").hide();
			}
			else {
				$("#editor > div.constant > ul > li.value").show();
				$("#editor > div.constant > ul > li.data.value > *").hide();
				$("#editor > div.constant > ul > li.data.value > ." + targetValueName).show();
			}
		},
		getData: function() {
			if ($('#editor > div.constant > ul > li.type.data input:radio:checked').length == 0) {
				alert("no type specified");
				return false;
			}

			var name = $("#editor > div.constant > ul > li.name.data input").val();
			var comment = $("#editor > div.constant > ul > li.comment.data textarea").val();
			var type = $('#editor > div.constant > ul > li.type.data input:radio:checked').val();
			var value = null;
			switch(type) {
				case "INTEGER":
					value = parseInt($('#editor > div.constant > ul > li.value.data > div.integer > input').val());
					break;
				case "FLOAT":
					value = $('#editor > div.constant > ul > li.value.data > div.float > input').val() * 1.0;
					break;
				case "BOOLEAN":
					value = ($('#editor > div.constant > ul > li.value.data > div.boolean > select option:selected').val() == true) ? true : false;
					break;
				case "STRING":
					value = $('#editor > div.constant > ul > li.value.data > div.string > input').val();
					break;
			}
			if (name.length == 0) {
				alert("name field cannot be left empty");
				return false;
			}
			if (value == null) {
				alert("no default value");
				return false;
			}
			return new UM.Constant(name, comment, type, value);
		}
	},
	AttributeMgr : {
		init: function() {
			$("#editor > div.attribute > ul > li.name.data input").val("");
			$("#editor > div.attribute > ul > li.comment.data textarea").val("");
			$("#editor > div.attribute > ul > li.type.data input:radio").prop("checked", false);
			$("#editor > div.attribute > ul > li.value.data input:checkbox").prop("checked", false);
			$("#editor > div.attribute > ul > li.value.data select").val($("#editor > div.attribute > ul > li.value.data select option:first").val());
			$("#editor > div.attribute > ul > li.value.data .droparea").text("").addClass("empty");
			$("#editor > div.attribute > ul > li.value.data > div.integer .droparea").droppable({
						hoverClass: "ui-state-highlight",
						drop: function(event, ui) {
							var treePath = new TreePath(ui.draggable);
							if (treePath && (treePath.type == "CONSTANT")) {
								var constant = DataMgr.findConstant(DataMgr.findObject(DataMgr.findNamespace(treePath.pathArr[0]), treePath.pathArr[1]), treePath.pathArr[2]);
								if (constant && constant.type == "INTEGER") {
									$("#editor > div.attribute > ul > li.value.data > div.integer .droparea").text(treePath.pathArr[0] + "." + treePath.pathArr[1] + "." + treePath.pathArr[2]).removeClass("empty");
								}
							}
						}
					});
			$("#editor > div.attribute > ul > li.value.data > div.float .droparea").droppable({
						hoverClass: "ui-state-highlight",
						drop: function(event, ui) {
							var treePath = new TreePath(ui.draggable);
							if (treePath && (treePath.type == "CONSTANT")) {
								var constant = DataMgr.findConstant(DataMgr.findObject(DataMgr.findNamespace(treePath.pathArr[0]), treePath.pathArr[1]), treePath.pathArr[2]);
								if (constant && constant.type == "FLOAT") {
									$("#editor > div.attribute > ul > li.value.data > div.float .droparea").text(treePath.pathArr[0] + "." + treePath.pathArr[1] + "." + treePath.pathArr[2]).removeClass("empty");
								}
							}
						}
					});
			$("#editor > div.attribute > ul > li.value.data > div.boolean .droparea").droppable({
						hoverClass: "ui-state-highlight",
						drop: function(event, ui) {
							var treePath = new TreePath(ui.draggable);
							if (treePath && (treePath.type == "CONSTANT")) {
								var constant = DataMgr.findConstant(DataMgr.findObject(DataMgr.findNamespace(treePath.pathArr[0]), treePath.pathArr[1]), treePath.pathArr[2]);
								if (constant && constant.type == "BOOLEAN") {
									$("#editor > div.attribute > ul > li.value.data > div.boolean .droparea").text(treePath.pathArr[0] + "." + treePath.pathArr[1] + "." + treePath.pathArr[2]).removeClass("empty");
								}
							}
						}
					});
			$("#editor > div.attribute > ul > li.value.data > div.string .droparea").droppable({
						hoverClass: "ui-state-highlight",
						drop: function(event, ui) {
							var treePath = new TreePath(ui.draggable);
							if (treePath && (treePath.type == "CONSTANT")) {
								var constant = DataMgr.findConstant(DataMgr.findObject(DataMgr.findNamespace(treePath.pathArr[0]), treePath.pathArr[1]), treePath.pathArr[2]);
								if (constant && constant.type == "STRING") {
									$("#editor > div.attribute > ul > li.value.data > div.string .droparea").text(treePath.pathArr[0] + "." + treePath.pathArr[1] + "." + treePath.pathArr[2]).removeClass("empty");
								}
							}
						}
					});
			$("#editor > div.attribute > ul > li.value.data > div.object .droparea").droppable({
						hoverClass: "ui-state-highlight",
						drop: function(event, ui) {
							var treePath = new TreePath(ui.draggable);
							if (treePath && (treePath.type == "OBJECT")) {
								var object = DataMgr.findObject(DataMgr.findNamespace(treePath.pathArr[0]), treePath.pathArr[1]);
								if (object) {
									$("#editor > div.attribute > ul > li.value.data > div.object .droparea").text(treePath.pathArr[0] + "." + treePath.pathArr[1]).removeClass("empty");
								}
							}
						}
					});
			$("#editor > div.attribute > ul > li.value.data > div.array .droparea").droppable({
						hoverClass: "ui-state-highlight",
						drop: function(event, ui) {
							var treePath = new TreePath(ui.draggable);
							if (treePath && (treePath.type == "OBJECT")) {
								var object = DataMgr.findObject(DataMgr.findNamespace(treePath.pathArr[0]), treePath.pathArr[1]);
								if (object) {
									$("#editor > div.attribute > ul > li.value.data > div.array .droparea").text(treePath.pathArr[0] + "." + treePath.pathArr[1]).removeClass("empty");
								}
							}
						}
					});

			EditorMgr.AttributeMgr.onTypeChanged();
		},
		onTypeChanged: function() {
			var targetValueName = false;
			if ($('#editor > div.attribute > ul > li.type.data input:radio:checked').length > 0) {
				targetValueName = $("#editor > div.attribute > ul > li.type.data input:radio:checked").val().toLowerCase();
			}
			if (!targetValueName) {
				$("#editor > div.attribute > ul > li.value").hide();
				$("#editor > div.attribute > ul > li.filter").hide();
				return;
			}

			$("#editor > div.attribute > ul > li.value").show();
			$("#editor > div.attribute > ul > li.value.data > *").hide();
			$("#editor > div.attribute > ul > li.value.data > ." + targetValueName).show();
			EditorMgr.AttributeMgr.onReferenceToggled(targetValueName);

			if ((targetValueName == "string") || (targetValueName == "integer") || (targetValueName == "float")) {
				$("#editor > div.attribute > ul > li.filter").show();
				$("#editor > div.attribute > ul > li.filter.data > *").hide();
				$("#editor > div.attribute > ul > li.filter.data > ." + targetValueName).show();
			}
		},
		onReferenceToggled: function(target) {
			$("#editor > div.attribute li.data.value > ." + target + " > *").show();
			if ($("#editor > div.attribute li.data.value > ." + target + " input:checkbox").prop("checked")) {
				$("#editor > div.attribute li.data.value > ." + target + " > *:eq(0)").hide();
			}
			else {
				$("#editor > div.attribute li.data.value > ." + target + " > *:eq(1)").hide();
			}
		},
		onFilterToggled: function(target) {
			if ($("#editor > div.attribute li.data.filter > div." + target + " > *:first-child input:checkbox").prop("checked")) {
				$("#editor > div.attribute li.data.filter > div." + target + " > *:not(:first-child)").show();
			}
			else {
				$("#editor > div.attribute li.data.filter > div." + target + " > *:not(:first-child)").hide();
			}
		},
		getData: function() {
			if ($('#editor > div.attribute > ul > li.type.data input:radio:checked').length == 0) {
				alert("no type specified");
				return false;
			}

			var name = $("#editor > div.attribute > ul > li.name.data input").val();
			var comment = $("#editor > div.attribute > ul > li.comment.data textarea").val();
			var type = $('#editor > div.attribute > ul > li.type.data input:radio:checked').val();
			var value = null;

			switch(type) {
				case "INTEGER":
					if ($("#editor > div.attribute > ul > li.value.data div.integer > label > input:checkbox").prop("checked")) {
						value = EditorMgr.AttributeMgr._parseReference($("#editor > div.attribute > ul > li.value.data div.integer > div.droparea"));
					}
					else {
						value = parseInt($("#editor > div.attribute > ul > li.value.data div.integer > input").val());
					}
					break;
				case "FLOAT":
					if ($("#editor > div.attribute > ul > li.value.data div.float > label > input:checkbox").prop("checked")) {
						value = EditorMgr.AttributeMgr._parseReference($("#editor > div.attribute > ul > li.value.data div.float > div.droparea"));
					}
					else {
						value = $("#editor > div.attribute > ul > li.value.data div.float > input").val() * 1.0;
					}
					break;
				case "BOOLEAN":
					if ($("#editor > div.attribute > ul > li.value.data div.boolean > label > input:checkbox").prop("checked")) {
						value = EditorMgr.AttributeMgr._parseReference($("#editor > div.attribute > ul > li.value.data div.boolean > div.droparea"));
					}
					else {
						value = $("#editor > div.attribute > ul > li.value.data div.boolean > select option:selected").val() ? true : false;
					}
					break;
				case "STRING":
					if ($("#editor > div.attribute > ul > li.value.data div.string > label > input:checkbox").prop("checked")) {
						value = EditorMgr.AttributeMgr._parseReference($("#editor > div.attribute > ul > li.value.data div.string > div.droparea"));
					}
					else {
						value = $("#editor > div.attribute > ul > li.value.data div.string > input").val();
					}
					break;
				case "OBJECT":
					value = EditorMgr.AttributeMgr._parseReference($("#editor > div.attribute > ul > li.value.data div.object > div.droparea"));
					break;
				case "ARRAY":
					value = EditorMgr.AttributeMgr._parseReference($("#editor > div.attribute > ul > li.value.data div.array > div.droparea"));
					break;
			}

			var filter = null;
			switch(type) {
				case "INTEGER":
					if ($("#editor > div.attribute > ul > li.filter.data > div.integer > label > input:checkbox").prop("checked")) {
						var includeLower = ($("#editor > div.attribute > ul > li.filter.data > div.integer > select:first option:selected").val() == '[');
						var includeUpper = ($("#editor > div.attribute > ul > li.filter.data > div.integer > select:last option:selected").val() == ']');
						var rangeLower = parseInt($("#editor > div.attribute > ul > li.filter.data > div.integer > input:first").val());
						var rangeUpper = parseInt($("#editor > div.attribute > ul > li.filter.data > div.integer > input:last").val());
						filter = {
							range:{
								lower:rangeLower,
								upper:rangeUpper
							},
							include:{
								lower:includeLower,
								upper:includeUpper
							}
						};
					}
					break;
				case "FLOAT":
					if ($("#editor > div.attribute > ul > li.filter.data > div.float > label > input:checkbox").prop("checked")) {
						var includeLower = ($("#editor > div.attribute > ul > li.filter.data > div.float > select:first option:selected").val() == '[');
						var includeUpper = ($("#editor > div.attribute > ul > li.filter.data > div.float > select:last option:selected").val() == ']');
						var rangeLower = parseInt($("#editor > div.attribute > ul > li.filter.data > div.float > input:first").val());
						var rangeUpper = parseInt($("#editor > div.attribute > ul > li.filter.data > div.float > input:last").val());
						filter = {
							range:{
								lower:rangeLower,
								upper:rangeUpper
							},       
							include:{
								lower:includeLower,
								upper:includeUpper
							}
						};
					}
					break;
				case "STRING":
					if ($("#editor > div.attribute > ul > li.filter.data > div.string > label > input:checkbox").prop("checked")) {
						filter = $("#editor > div.attribute > ul > li.filter.data > div.string > input").val();
					}
					break;
			}
			if (name.length == 0) {
				alert("name field cannot be left empty");
				return false;
			}
			if (value == null) {
				alert("no value specified");
				return false;
			}
			return new UM.Attribute(name, comment, type, value, filter);
		},
		_parseReference:function(target) {
			var reference = target.text().split(".");
			if (reference.length == 2) {
				return {namespace:reference[0], object:reference[1]};
			}
			return {namespace:reference[0], object:reference[1], constant:reference[2]};
		}
	}
};
