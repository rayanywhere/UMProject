var Editor = {
	root:false,
	init: function() {
		NotificationCenter.addObserver(Editor);
		Editor.root = $("#editor");

		Editor.root.find(">.droppable").droppable({accept:"#toolbar .widget",hoverClass:"ui-state-highlight", drop: Editor._onDrop});
	},
	onEventUiRemove:function(target) {
		if (target.parents("#editor").length > 0) {
			Editor.show(null);
		}
	},
	onEventReset:function() {
		Editor.show(null);
	},
	_onDrop: function(ui, evt) {
		if (Toolbar.root.has(evt.draggable[0])) {
			if (evt.draggable.hasClass("namespace")) {
				Editor.show("namespace");
			}
			else if (evt.draggable.hasClass("object")) {
				Editor.show("object");
			}
			else if (evt.draggable.hasClass("constant")) {
				Editor.show("constant");
			}
			else if (evt.draggable.hasClass("attribute")) {
				Editor.show("attribute");
			}
		}
		else {
			alert("NO");
		}
	},
	show:function(editorName) {
		Editor.root.find(">div>div").hide();
		Editor.root.find(">h1>div").removeClass("namespace").removeClass("object").removeClass("constant").removeClass("attribute");
		if (editorName) {
			Editor.root.find(">div>div." + editorName).show();
			Editor.root.find(">h1>span").text(editorName.charAt(0).toUpperCase() + editorName.slice(1));
			Editor.root.find(">h1>div").addClass(editorName);
			Editor.root.find(">div").removeClass("empty");
			switch(editorName) {
				case "namespace":
					Editor.Namespace.init();
					break;
				case "object":
					Editor.Object.init();
					break;
				case "constant":
					Editor.Constant.init();
					break;
				case "attribute":
					Editor.Attribute.init();
					break;
			}
		}
		else {
			Editor.root.find(">h1>span").text("Getting Started");
			Editor.root.find(">h1>div").removeClass("namespace").removeClass("object").removeClass("constant").removeClass("attribute");
			Editor.root.find(">div").addClass("empty");
		}
	},
	Namespace: {
		root: false,
		init: function() {
			Editor.Namespace.root = Editor.root.find(">div>div.namespace");
			Editor.Namespace.root.find("input:text").val("");
			Editor.Namespace.root.find("textarea").val("");
		},
		getData: function() {
			var name = Editor.Namespace.root.find("input:text").val();
			var comment = Editor.Namespace.root.find("textarea").val();
			if (name.length == 0) {
				alert("name field cannot be left empty");
				return false;
			}

			return new UM.Namespace(name, comment, []);
	    }
	},
	Object: {
		root:false,
		init: function() {
			Editor.Object.root = Editor.root.find(">div>div.object");
			Editor.Object.root.find("input:text").val("");
			Editor.Object.root.find("textarea").val("");
		},
		getData: function() {
			var name = Editor.Object.root.find("input:text").val();
			var comment = Editor.Object.root.find("textarea").val();
			if (name.length == 0) {
				alert("name field cannot be left empty");
				return false;
			}

			return new UM.Object(name, comment, [], []);
		}
	},
	Constant: {
		root: false,
		init: function() {
			Editor.Constant.root = Editor.root.find(">div>div.constant");
			Editor.Constant.root.find("input[type=text],input[type=number]").val("");
			Editor.Constant.root.find("textarea").val("");
			Editor.Constant.root.find("input:radio").prop("checked", false);

			Editor.Constant.root.find(">ul>li:gt(5)").hide()
		},
		onTypeChanged: function() {
			var target = Editor.Constant.root.find("input:radio:checked").val().toLowerCase();

			Editor.Constant.root.find(">ul>li:gt(5)").show();
			Editor.Constant.root.find(">ul>li:eq(7) > *").hide();
			Editor.Constant.root.find(">ul>li:eq(7) > ." + target).show();
		},
		getData: function() {
			if (Editor.Constant.root.find("input:radio:checked").length == 0) {
				alert("no type specified");
				return false;
			}

			var name = Editor.Constant.root.find(">ul>li:eq(1) input:text").val();
			var comment = Editor.Constant.root.find(">ul>li:eq(3) textarea").val();
			var type = Editor.Constant.root.find("input:radio:checked").val();
			var value = null;
			switch(type) {
				case "INTEGER":
					value = parseInt(Editor.Constant.root.find(">ul>li:eq(7) > div.integer input").val()) || 0;
					break;
				case "FLOAT":
					value = Editor.Constant.root.find(">ul>li:eq(7) > div.float input").val() * 1.0;
					break;
				case "BOOLEAN":
					value = (Editor.Constant.root.find(">ul>li:eq(7) > div.boolean select option:selected").val() == "true") ? true : false;
					break;
				case "STRING":
					value = Editor.Constant.root.find(">ul>li:eq(7) > div.string input").val();
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
	Attribute: {
		root: false,
		init: function() {
			Editor.Attribute.root = Editor.root.find(">div>div.attribute");
			Editor.Attribute.root.find("input[type=text],input[type=number]").val("");
			Editor.Attribute.root.find("textarea").val("");
			Editor.Attribute.root.find("input:radio").prop("checked", false);
			Editor.Attribute.root.find("input:checkbox").prop("checked", false);

			Editor.Attribute.root.find(".reference > .integer.droppable").droppable({accept:"#tree .widget.constant", hoverClass:"ui-state-highlight", drop: Editor.Attribute.onConstantReferenceDropped});
			Editor.Attribute.root.find(".reference > .float.droppable").droppable({accept:"#tree .widget.constant", hoverClass:"ui-state-highlight", drop: Editor.Attribute.onConstantReferenceDropped});
			Editor.Attribute.root.find(".reference > .boolean.droppable").droppable({accept:"#tree .widget.constant", hoverClass:"ui-state-highlight", drop: Editor.Attribute.onConstantReferenceDropped});
			Editor.Attribute.root.find(".reference > .string.droppable").droppable({accept:"#tree .widget.constant", hoverClass:"ui-state-highlight", drop: Editor.Attribute.onConstantReferenceDropped});
			Editor.Attribute.root.find(".reference > .object.droppable").droppable({accept:"#tree .widget.object", hoverClass:"ui-state-highlight", drop: Editor.Attribute.onObjectReferenceDropped});
			Editor.Attribute.root.find(".reference > .array.droppable").droppable({accept:"#tree .widget.object", hoverClass:"ui-state-highlight", drop: Editor.Attribute.onObjectReferenceDropped});

			Editor.Attribute.root.find(">ul>li:gt(5)").hide();
		},
		onConstantReferenceDropped:function(ui, evt) {
			var components = evt.draggable.parent().attr("id").split("_");
			var namespace = Data.findNamespace(components[1]);
			var object = Data.findObject(namespace, components[2]);
			var constant = Data.findConstant(namespace, object, components[4]);

			$(ui.target).text(namespace.name + "." + object.name + "." + constant.name);
			$(ui.target).removeClass("empty");
		},
		onObjectReferenceDropped:function(ui, evt) {
			var components = evt.draggable.parent().next().attr("id").split("_");
			var namespace = Data.findNamespace(components[1]);
			var object = Data.findObject(namespace, components[2]);

			$(ui.target).text(namespace.name + "." + object.name);
			$(ui.target).removeClass("empty");
		},
		onTypeChanged: function() {
			var target = Editor.Attribute.root.find("input:radio:checked").val();
			Editor.Attribute.root.find(">ul>li:gt(5)").hide();
			switch(target) {
				case "INTEGER":
				case "FLOAT":
				case "STRING":
					Editor.Attribute.root.find(">ul>li:gt(5)").show();
					Editor.Attribute.root.find(">ul>li:eq(6) input[type=checkbox]").prop("checked", false);
					Editor.Attribute.root.find(">ul>li:eq(6) input[type=checkbox]").prop("disabled", false);
					Editor.Attribute.onReferenceChanged();
					Editor.Attribute.root.find(">ul>li:eq(8) input[type=checkbox]").prop("disabled", false);
					Editor.Attribute.root.find(">ul>li:eq(8) input[type=checkbox]").prop("checked", false);
					Editor.Attribute.onFilterChanged();
					break;
				case "BOOLEAN":
					Editor.Attribute.root.find(">ul>li:gt(5)").show();
					Editor.Attribute.root.find(">ul>li:eq(6) input[type=checkbox]").prop("checked", false);
					Editor.Attribute.root.find(">ul>li:eq(6) input[type=checkbox]").prop("disabled", false);
					Editor.Attribute.onReferenceChanged();
					Editor.Attribute.root.find(">ul>li:gt(7)").hide();
					break;
				case "OBJECT":
				case "ARRAY":
					Editor.Attribute.root.find(">ul>li:gt(5)").show();
					Editor.Attribute.root.find(">ul>li:eq(6) input[type=checkbox]").prop("checked", true);
					Editor.Attribute.root.find(">ul>li:eq(6) input[type=checkbox]").prop("disabled", true);
					Editor.Attribute.onReferenceChanged();
					Editor.Attribute.root.find(">ul>li:gt(7)").hide();
					break;
			}
		},
		onReferenceChanged: function() {
			var target = Editor.Attribute.root.find("input:radio:checked").val();
			if (Editor.Attribute.root.find(">ul>li:eq(6) input[type=checkbox]").prop("checked")) {
				Editor.Attribute.root.find(">ul>li:eq(7) > div.value").hide();
				Editor.Attribute.root.find(">ul>li:eq(7) > div.reference").show();
				Editor.Attribute.root.find(">ul>li:eq(7) > div.reference > *").hide();
				Editor.Attribute.root.find(">ul>li:eq(7) > div.reference > ." + target.toLowerCase()).show();
			}
			else {
				Editor.Attribute.root.find(">ul>li:eq(7) > div.reference").hide();
				Editor.Attribute.root.find(">ul>li:eq(7) > div.value").show();
				Editor.Attribute.root.find(">ul>li:eq(7) > div.value > *").hide()
				Editor.Attribute.root.find(">ul>li:eq(7) > div.value > ." + target.toLowerCase()).show();
			}
		},
		onFilterChanged: function() {
			var target = Editor.Attribute.root.find("input:radio:checked").val();
			if (Editor.Attribute.root.find(">ul>li:eq(8) input[type=checkbox]").prop("checked")) {
				Editor.Attribute.root.find(">ul>li:eq(9)").show();
				Editor.Attribute.root.find(">ul>li:eq(9) > *").hide();
				Editor.Attribute.root.find(">ul>li:eq(9) > ." + target.toLowerCase()).show();
			}
			else {
				Editor.Attribute.root.find(">ul>li:eq(9)").hide();
			}
		},
		getData: function() {
			if (Editor.Attribute.root.find("input:radio:checked").length == 0) {
				alert("no type specified");
				return false;
			}

			var name = Editor.Attribute.root.find(">ul>li:eq(1) input:text").val();
			var comment = Editor.Attribute.root.find(">ul>li:eq(3) textarea").val();
			var type = Editor.Attribute.root.find("input:radio:checked").val();
			var value = null;
			var isReference = Editor.Attribute.root.find(">ul>li:eq(6) input:checkbox").prop("checked");
			var hasFilter = Editor.Attribute.root.find(">ul>li:eq(8) input:checkbox").prop("checked");

			if (isReference) {
				switch(type) {
					case "OBJECT":
					case "ARRAY":
						value = Editor.Attribute._parseObjectReference(Editor.Attribute.root.find(">ul>li:eq(7) > div.reference > ." + type.toLowerCase()));
						break;
					default:
						value = Editor.Attribute._parseConstantReference(Editor.Attribute.root.find(">ul>li:eq(7) > div.reference > ." + type.toLowerCase()));
						break;
				}
			}
			else {
				switch(type) {
					case "INTEGER":
						value = parseInt(Editor.Attribute.root.find(">ul>li:eq(7) > div.value > input.integer").val()) || 0;
						break;
					case "FLOAT":
						value = Editor.Attribute.root.find(">ul>li:eq(7) > div.value > input.float").val() * 1.0;
						break;
					case "BOOLEAN":
						value = (Editor.Attribute.root.find(">ul>li:eq(7) > div.value > select.boolean option:selected").val() == "true") ? true : false;
						break;
					case "STRING":
						value = Editor.Attribute.root.find(">ul>li:eq(7) > div.value > input.string").val();
						break;
					}
			}

			var filter = null;
			if (hasFilter) {
				switch(type) {
					case "INTEGER":
						var includeLower = (Editor.Attribute.root.find(">ul>li:eq(9) > div.integer > select:first option:selected").val() == '[');
						var includeUpper = (Editor.Attribute.root.find(">ul>li:eq(9) > div.integer > select:last option:selected").val() == ']');
						var rangeLower = parseInt(Editor.Attribute.root.find(">ul>li:eq(9) > div.integer > input:first").val()) || 0;
						var rangeUpper = parseInt(Editor.Attribute.root.find(">ul>li:eq(9) > div.integer > input:last").val()) || 0;
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
						break;
					case "FLOAT":
						var includeLower = (Editor.Attribute.root.find(">ul>li:eq(9) > div.float > select:first option:selected").val() == '[');
						var includeUpper = (Editor.Attribute.root.find(">ul>li:eq(9) > div.float > select:last option:selected").val() == ']');
						var rangeLower = Editor.Attribute.root.find(">ul>li:eq(9) > div.float > input:first").val() * 1.0;
						var rangeUpper = Editor.Attribute.root.find(">ul>li:eq(9) > div.float > input:last").val() * 1.0;
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
						break;
					case "STRING":
						filter = Editor.Attribute.root.find(">ul>li:eq(9) > div.string > input").val();
						break;
				}
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
		_parseObjectReference: function(target) {
			var target = target.text().split('.');
			if (target.length != 2) {
				return false;
			}
			return {namespace:target[0], object:target[1]};
		},
		_parseConstantReference: function(target) {
			var target = target.text().split('.');
			if (target.length != 3) {
				return false;
			}
			return {namespace:target[0], object:target[1], constant:target[2]};
		}
	}
};
