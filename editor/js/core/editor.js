var Editor = {
	init: function() {
		NotificationCenter.addObserver(Editor);
		Editor.Namespace.init();
		Editor.Object.init();
		Editor.Constant.init();
		Editor.Attribute.init();
	},
	Namespace: {
		init: function() {
			NotificationCenter.addObserver(Editor.Namespace);
			$$("editor_namespace_button").attachEvent("onItemClick", Editor.Namespace._onSubmit);
		},
		_onSubmit:function() {
			var namespace = new UM.Namespace($$("editor_namespace_name").getValue(), $$("editor_namespace_comment").getValue(), []);
			if (!namespace.name || (namespace.name.length == 0)) {
				webix.message("name field cannot be empty");
				return;
			}

			if (Data.findNamespace(namespace.name)) {
				webix.message("duplicated namespace");
				return;
			}
			Data.addNamespace(namespace);
		}
	},
	Object: {
		init: function() {
			NotificationCenter.addObserver(Editor.Object);
			$$("editor_object_button").attachEvent("onItemClick", Editor.Object._onSubmit);
		},
		_onSubmit:function() {
			var object = new UM.Object($$("editor_object_name").getValue(), $$("editor_object_comment").getValue(), [], []);
			if (!object.name || (object.name.length == 0)) {
				webix.message("name field cannot be empty");
				return;
			}

			var namespace = Tree.getSelectedNamespace();
			if (!namespace || Data.findObject(namespace, object.name)) {
				webix.message("duplicated object");
				return;
			}
			Data.addObject(namespace, object);
		},
		onTreeEventSelectChanged:function(node) {
			(node.$level == 1) ? $$("editor_object_button").enable() : $$("editor_object_button").disable();
		}
	},
	Constant: {
		init: function() {
			NotificationCenter.addObserver(Editor.Constant);
			$$("editor_constant_type").attachEvent("onChange", Editor.Constant._onTypeChanged);
			$$("editor_constant_button").attachEvent("onItemClick", Editor.Constant._onSubmit);
		},
		_onTypeChanged: function(newV, oldV) {
			$$("editor_constant_value_" + oldV.toLowerCase()).hide();
			$$("editor_constant_value_" + newV.toLowerCase()).show();
		},
		_onSubmit:function() {
			var constant = new UM.Constant($$("editor_constant_name").getValue(), $$("editor_constant_comment").getValue(), $$("editor_constant_type").getValue().toUpperCase(), null);
			if (!constant.name || (constant.name.length == 0)) {
				webix.message("name field cannot be empty");
				return;
			}

			if (constant.type == "INTEGER") {
				constant.value = parseInt($$("editor_constant_value_" + constant.type.toLowerCase()).getValue()) || 0;
			}
			else if (constant.type == "FLOAT") {
				constant.value = $$("editor_constant_value_" + constant.type.toLowerCase()).getValue() * 1.0;
			}
			else if (constant.type == "BOOLEAN") {
				constant.value = ($$("editor_constant_value_" + constant.type.toLowerCase()).getValue() == "True") ? true : false;
			}
			else if (constant.type == "STRING") {
				constant.value = $$("editor_constant_value_" + constant.type.toLowerCase()).getValue();
			}
			else {
				webix.message("select a type of constant first");
				return;
			}

			var namespace = Tree.getSelectedNamespace();
			var object = Tree.getSelectedObject();
			if (!object || Data.findConstant(object, constant.name)) {
				webix.message("duplicated constant");
				return;
			}
			Data.addConstant(namespace, object, constant);
		},
		onTreeEventSelectChanged:function(node) {
			((node.$level == 3) && (node.value == "Constants")) ? $$("editor_constant_button").enable() : $$("editor_constant_button").disable();
		}
	},
	Attribute: {
		init: function() {
			NotificationCenter.addObserver(Editor.Attribute);
			$$("editor_attribute_type").attachEvent("onChange", Editor.Attribute._onTypeChanged);
			$$("editor_attribute_is_reference").attachEvent("onChange", Editor.Attribute._onIsReferenceChanged);
			$$("editor_attribute_use_filter").attachEvent("onChange", Editor.Attribute._onUseFilterChanged);
			$$("editor_attribute_button").attachEvent("onItemClick", Editor.Attribute._onSubmit);
			webix.DragControl.addDrop($$("editor_attribute_value_reference_object").$view,{
			        $drop:function(source, target, context){
			         	var dnd = webix.DragControl.getContext();
			         	var components = dnd.source[0].replace(/^tree_/, "").split(".");
			         	if (components.length == 2) {
			         		$$("editor_attribute_value_reference_object").setValue(components[0] + "." + components[1]);
			         	}
			        }
			});
			webix.DragControl.addDrop($$("editor_attribute_value_reference_constant").$view,{
			        $drop:function(source, target, context){
			           	var dnd = webix.DragControl.getContext();
			         	var components = dnd.source[0].replace(/^tree_/, "").split(".");
			         	if ((components.length == 4) && (components[2].toLowerCase() == "constant")) {
			         		var namespace = Data.findNamespace(components[0]);
			         		var object = Data.findObject(namespace, components[1]);
			         		var constant = Data.findConstant(object, components[3]);
			         		if (constant && constant.type == $$("editor_attribute_type").getValue().toUpperCase()) {
			         			$$("editor_attribute_value_reference_constant").setValue(components[0] + "." + components[1] + "." + components[3]);
			         		}
			         		else {
			         			webix.message("type mismatch");
			         		}
			         	}
			        }
			});
		},
		_onTypeChanged: function(newV, oldV) {
			if ((newV == "Object") || (newV == "Array")) {
				$$("editor_attribute_is_reference").setValue(1);
				$$("editor_attribute_is_reference").disable();
			}
			else {
				$$("editor_attribute_is_reference").enable();
			}

			var targetId = "";
			var isReference = ($$("editor_attribute_is_reference").getValue() == 1);
			switch(newV) {
				case "Integer":
				case "Float":
				case "Boolean":
				case "String":
					targetId = isReference ? "editor_attribute_value_reference_constant" : "editor_attribute_value_" + newV.toLowerCase();
					break;
				case "Object":
				case "Array":
					targetId = "editor_attribute_value_reference_object";
					break;
			}

			$$(targetId).show();
			["editor_attribute_value_integer", "editor_attribute_value_float", "editor_attribute_value_boolean", "editor_attribute_value_string", "editor_attribute_value_reference_object", "editor_attribute_value_reference_constant"].forEach(function(element) {
				if (element != targetId) {
					$$(element).hide();
				}
			});

			if ((newV == "Integer") || (newV == "Float") || (newV == "String")) {
				$$("editor_attribute_use_filter").show();
			}
			else {
				$$("editor_attribute_use_filter").hide();
				$$("editor_attribute_use_filter").setValue(false);
			}
			Editor.Attribute._onUseFilterChanged($$("editor_attribute_use_filter").getValue(), false);
		},
		_onIsReferenceChanged:function(newV, oldV) {
			var targetId = "";
			var type = $$("editor_attribute_type").getValue();
			switch(type) {
				case "Integer":
				case "Float":
				case "Boolean":
				case "String":
					targetId = newV ? "editor_attribute_value_reference_constant" : "editor_attribute_value_" + type.toLowerCase();
					break;
				case "Object":
				case "Array":
					targetId = "editor_attribute_value_reference_object";
					break;
			}
			$$(targetId).show();
			["editor_attribute_value_integer", "editor_attribute_value_float", "editor_attribute_value_boolean", "editor_attribute_value_string", "editor_attribute_value_reference_object", "editor_attribute_value_reference_constant"].forEach(function(element) {
				if (element != targetId) {
					$$(element).hide();
				}
			});

			if ((type == "Integer") || (type == "Float") || (type == "String")) {
				$$("editor_attribute_use_filter").show();
			}
			else {
				$$("editor_attribute_use_filter").hide();
				$$("editor_attribute_use_filter").setValue(false);
			}
			Editor.Attribute._onUseFilterChanged($$("editor_attribute_use_filter").getValue(), false);
		},
		_onUseFilterChanged:function(newV, oldV) {
			if (newV) {
				var type = $$("editor_attribute_type").getValue();
				switch(type) {
					case "Integer":
					case "Float":
						$$("editor_attribute_filter_range").show();
						$$("editor_attribute_filter_regex").hide();
						break;
					default:
						$$("editor_attribute_filter_regex").show();
						$$("editor_attribute_filter_range").hide();
						break;
				}
			}
			else {
				$$("editor_attribute_filter_regex").hide();
				$$("editor_attribute_filter_range").hide();
			}
		},
		_onSubmit:function() {
			var attribute = new UM.Attribute($$("editor_attribute_name").getValue(), $$("editor_attribute_comment").getValue(), $$("editor_attribute_type").getValue().toUpperCase(), null, null);
			if (!attribute.name || (attribute.name.length == 0)) {
				webix.message("name field cannot be empty");
				return;
			}

			var isReference = ($$("editor_attribute_is_reference").getValue() == 1);
			var useFilter = ($$("editor_attribute_use_filter").getValue() == 1);

			if (isReference) {
				if ((attribute.type == "INTEGER") || (attribute.type == "FLOAT") || (attribute.type == "BOOLEAN") || (attribute.type == "STRING")) {
					if ($$("editor_attribute_value_reference_constant").getValue() == "") {
						webix.message("value incomplete");
						return;
					}
					var components = $$("editor_attribute_value_reference_constant").getValue().split(".");
					attribute.value = {namespace: components[0], object: components[1], constant: components[2]};
				}
				else {
					if ($$("editor_attribute_value_reference_object").getValue() == "") {
						webix.message("value incomplete");
						return;
					}
					var components = $$("editor_attribute_value_reference_object").getValue().split(".");
					attribute.value = {namespace: components[0], object: components[1]};
				}
			}
			else {
				if (attribute.type == "INTEGER") {
					attribute.value = parseInt($$("editor_attribute_value_" + attribute.type.toLowerCase()).getValue()) || 0;
				}
				else if (attribute.type == "FLOAT") {
					attribute.value = $$("editor_attribute_value_" + attribute.type.toLowerCase()).getValue() * 1.0;
				}
				else if (attribute.type == "BOOLEAN") {
					attribute.value = ($$("editor_attribute_value_" + attribute.type.toLowerCase()).getValue() == "True") ? true : false;
				}
				else if (attribute.type == "STRING") {
					attribute.value = $$("editor_attribute_value_" + attribute.type.toLowerCase()).getValue();
				}
				else {
					webix.message("select a type of attribute first");
					return;
				}
			}

			if (useFilter) {
				if (attribute.type == "INTEGER") {
					var lowerInclude = ($$("editor_attribute_filter_range_lower_include").getValue() == "[") ? true : false;
					var lowerRange = parseInt($$("editor_attribute_filter_range_lower_range").getValue());
					var upperInclude = ($$("editor_attribute_filter_range_upper_include").getValue() == "]") ? true : false;
					var upperRange = parseInt($$("editor_attribute_filter_range_upper_range").getValue());
					attribute.filter = {include:{lower:lowerInclude, upper:upperInclude}, range:{lower:lowerRange, upper:upperRange}};
				}
				else if (attribute.type == "FLOAT") {
					var lowerInclude = ($$("editor_attribute_filter_range_lower_include").getValue() == "[") ? true : false;
					var lowerRange = $$("editor_attribute_filter_range_lower_range").getValue() * 1.0
					var upperInclude = ($$("editor_attribute_filter_range_upper_include").getValue() == "]") ? true : false;
					var upperRange = $$("editor_attribute_filter_range_upper_range").getValue() * 1.0;
					attribute.filter = {include:{lower:lowerInclude, upper:upperInclude}, range:{lower:lowerRange, upper:upperRange}}; 
				}
				else if (attribute.type == "STRING") {
					attribute.filter = $$("editor_attribute_filter_regex").getValue();
				}
			}

			var namespace = Tree.getSelectedNamespace();
			var object = Tree.getSelectedObject();
			if (!object || Data.findAttribute(object, attribute.name)) {
				webix.message("duplicated attribute");
				return;
			}
			Data.addAttribute(namespace, object, attribute);
		},
		onTreeEventSelectChanged:function(node) {
			((node.$level == 3) && (node.value == "Attributes")) ? $$("editor_attribute_button").enable() : $$("editor_attribute_button").disable();
		}
	}
};