var Notification = {
	DATA_EVENT_NAMESPACE_ADDED:"DATA_EVENT_NAMESPACE_ADDED",
	DATA_EVENT_OBJECT_ADDED:"DATA_EVENT_OBJECT_ADDED",
	DATA_EVENT_CONSTANT_ADDED:"DATA_EVENT_CONSTANT_ADDED",
	DATA_EVENT_ATTRIBUTE_ADDED:"DATA_EVENT_ATTRIBUTE_ADDED",
	DATA_EVENT_NAMESPACE_REMOVED:"DATA_EVENT_NAMESPACE_REMOVED",
	DATA_EVENT_OBJECT_REMOVED:"DATA_EVENT_OBJECT_REMOVED",
	DATA_EVENT_CONSTANT_REMOVED:"DATA_EVENT_CONSTANT_REMOVED",
	DATA_EVENT_ATTRIBUTE_REMOVED:"DATA_EVENT_ATTRIBUTE_REMOVED",
	DATA_EVENT_RESET:"DATA_EVENT_RESET",

	WEB_DATA_EVENT_RESET:"WEB_DATA_EVENT_RESET",
	WEB_DATA_EVENT_VERSION_ADDED:"WEB_DATA_EVENT_VERSION_ADDED",
	WEB_DATA_EVENT_VERSION_REMOVED:"WEB_DATA_EVENT_VERSION_REMOVED",
	WEB_DATA_EVENT_INTERFACE_ADDED:"WEB_DATA_EVENT_INTERFACE_ADDED",
	WEB_DATA_EVENT_INTERFACE_REMOVED:"WEB_DATA_EVENT_INTERFACE_REMOVED",

	TREE_EVENT_SELECT_CHANGED:"TREE_EVENT_SELECT_CHANGED",
	WEB_TREE_EVENT_SELECT_CHANGED:"WEB_TREE_EVENT_SELECT_CHANGED"
};

var NotificationCenter = {
	_observers: [],
	addObserver: function(observer) {
		NotificationCenter._observers.push(observer);
	},
	removeObserver: function(observer) {
		var idx = NotificationCenter._observers.indexOf(observer);
		if (idx != -1) {
			NotificationCenter._observers.splice(idx, 1);
		}
	},
	post: function(evt, info) {
		evt = evt.toLowerCase().replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
		evt = "on" + evt.charAt(0).toUpperCase() + evt.slice(1);
		NotificationCenter._observers.forEach(function(observer) {
					if (observer[evt]) {
						observer[evt](info);
					}
				});
	}
};
