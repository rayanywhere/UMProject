var UM = {
	Namespace: function(name, comment, objects) {
		this.name = name;
		this.comment = comment;
		this.objects = objects;
	},
	Object: function(name, comment, constants, attributes) {
		this.name = name;
		this.comment = comment;
		this.constants = constants;
		this.attributes = attributes;
	},
	Constant: function(name, comment, type, value) {
		this.name = name;
		this.comment = comment;
		this.type = type;
		this.value = value;
	},
	Attribute: function(name, comment, type, value, filter) {
		this.name = name;
		this.comment = comment;
		this.type = type;
		this.value = value;
		if (filter)
			this.filter = filter;
	}
};

var DataMgr = {
	_namespaces:[],
	init:function() {
		NotificationCenter.addObserver(DataMgr);
	},
	download:function() {
		var blob = new Blob([JSON.stringify(DataMgr._namespaces, null, 2)], {type: "text/json;charset=utf-8"});
	   	saveAs(blob, "UM.Core.json");
	},
	upload:function(file) {
		var reader = new FileReader();
		reader.onload = function(e) {
			DataMgr.load(JSON.parse(e.target.result));
		};
		reader.readAsText(file);
	},
	load:function(namespaces) {
		DataMgr._namespaces = [];
		NotificationCenter.post(Notification.EVENT_DATA_RESET);

		namespaces.forEach(function(item) {
					var namespace = new UM.Namespace(item.name, item.comment, []);
					DataMgr.addNamespace(namespace);

					item.objects.forEach(function(item) {
							var object = new UM.Object(item.name, item.comment, [], []);
							DataMgr.addObject(namespace, object);

							item.constants.forEach(function(item) {
									var constant = new UM.Constant(item.name, item.comment, item.type, item.value);
									DataMgr.addConstant(namespace, object, constant);
								});
							item.attributes.forEach(function(item) {
									var attribute = new UM.Attribute(item.name, item.comment, item.type, item.value, item.filter);
									DataMgr.addAttribute(namespace, object, attribute);
								});
						});
				});
	},
	findNamespace:function(targetName) {
		var targetNamespace = false;
		DataMgr._namespaces.forEach(function(element) {
					if (element.name == targetName) {
						targetNamespace = element;
					}
				});
		return targetNamespace;
	},
	findObject:function(namespace, targetName) {
		var targetObject = false;
		namespace.objects.forEach(function(element) {
					if (element.name == targetName) {
						targetObject = element;
					}
				});
		return targetObject;
	},
	findConstant:function(object, targetName) {
		var targetConstant = false;
		object.constants.forEach(function(element) {
					if (element.name == targetName) {
						targetConstant = element;
					}
				});
		return targetConstant;
	},
	findAttribute:function(object, targetName) {
		var targetAttribute = false;
		object.attributes.forEach(function(element) {
					if (element.name == targetName) {
						targetAttribute = element;
					}
				});
		return targetAttribute;
	},
	addNamespace:function(namespace) {
		if (!namespace) {
			namespace = EditorMgr.NamespaceMgr.getData();
		}
		if (!namespace) {
			return;
		}
		for(var idx = 0; idx < DataMgr._namespaces.length; ++idx) {
			if (DataMgr._namespaces[idx].name == namespace.name) {
				alert("duplicated namespace");
				return;
			}
		}

		DataMgr._namespaces.push(namespace);
		NotificationCenter.post(Notification.EVENT_DATA_NAMESPACE_ADDED, namespace);
	},
	removeNamespace:function(name) {
		for(var idx = 0; idx < DataMgr._namespaces.length; ++idx) {
			if (DataMgr._namespaces[idx].name == name) {
				var deleted = DataMgr._namespaces.splice(idx, 1);
				NotificationCenter.post(Notification.EVENT_DATA_NAMESPACE_REMOVED, deleted[0]);
				return;
			}
		}
	},
	addObject:function(namespace, object) {
		if (!object) {
			object = EditorMgr.ObjectMgr.getData();
		}
		if (!object) {
			return;
		}

		for(var idx = 0; idx < namespace.objects.length; ++idx) {
			if (namespace.objects[idx].name == object.name) {
				alert("duplicated object");
				return;
			}
		}

		namespace.objects.push(object);
		NotificationCenter.post(Notification.EVENT_DATA_OBJECT_ADDED, {namespace:namespace, object:object});
	},
	removeObject:function(nameOfNamespace, nameOfObject) {
		var namespace = DataMgr.findNamespace(nameOfNamespace);
		if (namespace) {
			for(var idx = 0; idx < namespace.objects.length; ++idx) {
				if (namespace.objects[idx].name == nameOfObject) {
					var deleted = namespace.objects.splice(idx, 1);
					NotificationCenter.post(Notification.EVENT_DATA_OBJECT_REMOVED, {namespace:namespace, object:deleted[0]});
					return;
				}
			}
		}
	},
	addConstant:function(namespace, object, constant) {
		if (!constant) {
			constant = EditorMgr.ConstantMgr.getData();
		}
		if (!constant) {
			return;
		}

		for(var idx = 0; idx < object.constants.length; ++idx) {
			if (object.constants[idx].name == constant.name) {
				alert("duplicated constant");
				return;
			}
		}

		object.constants.push(constant);
		NotificationCenter.post(Notification.EVENT_DATA_CONSTANT_ADDED, {namespace:namespace, object:object, constant:constant});
	},
	removeConstant:function(nameOfNamespace, nameOfObject, nameOfConstant) {
		var namespace = DataMgr.findNamespace(nameOfNamespace);
		if (namespace) {
			var object = DataMgr.findObject(namespace, nameOfObject);
			if (object) {
				for(var idx = 0; idx < object.constants.length; ++idx) {
					if (object.constants[idx].name == nameOfConstant) {
						var deleted = object.constants.splice(idx, 1);
						NotificationCenter.post(Notification.EVENT_DATA_CONSTANT_REMOVED, {namespace:namespace, object:object, constant:deleted[0]});
						return;
					}
				}
			}
		}
	},
	addAttribute:function(namespace, object, attribute) {
		if (!attribute) {
			attribute = EditorMgr.AttributeMgr.getData();
		}
		if (!attribute) {
			return;
		}

		for(var idx = 0; idx < object.attributes.length; ++idx) {
			if (object.attributes[idx].name == attribute.name) {
				alert("duplicated attribute");
				return;
			}
		}

		object.attributes.push(attribute);
		NotificationCenter.post(Notification.EVENT_DATA_ATTRIBUTE_ADDED, {namespace:namespace, object:object, attribute:attribute});
	},
	removeAttribute:function(nameOfNamespace, nameOfObject, nameOfAttribute) {
		var namespace = DataMgr.findNamespace(nameOfNamespace);
		if (namespace) {
			var object = DataMgr.findObject(namespace, nameOfObject);
			if (object) {
				for(var idx = 0; idx < object.attributes.length; ++idx) {
					if (object.attributes[idx].name == nameOfAttribute) {
						 var deleted = object.attributes.splice(idx, 1);
						  NotificationCenter.post(Notification.EVENT_DATA_ATTRIBUTE_REMOVED, {namespace:namespace, object:object, attribute:deleted[0]});
						  return;
					}
				}
			}
		}
	}
}
