var Notification = {
	EVENT_NAMESPACE_ADDED:"EVENT_NAMESPACE_ADDED",
	EVENT_OBJECT_ADDED:"EVENT_OBJECT_ADDED",
	EVENT_CONSTANT_ADDED:"EVENT_CONSTANT_ADDED",
	EVENT_ATTRIBUTE_ADDED:"EVENT_ATTRIBUTE_ADDED",
	EVENT_NAMESPACE_REMOVED:"EVENT_NAMESPACE_REMOVED",
	EVENT_OBJECT_REMOVED:"EVENT_OBJECT_REMOVED",
	EVENT_CONSTANT_REMOVED:"EVENT_CONSTANT_REMOVED",
	EVENT_ATTRIBUTE_REMOVED:"EVENT_ATTRIBUTE_REMOVED",
	EVENT_RESET:"EVENT_RESET",

	EVENT_WEB_VERSION_ADDED:"EVENT_WEB_VERSION_ADDED",
	EVENT_WEB_VERSION_REMOVED:"EVENT_WEB_VERSION_REMOVED",
	EVENT_WEB_INTERFACE_ADDED:"EVENT_WEB_INTERFACE_ADDED",
	EVENT_WEB_INTERFACE_REMOVED:"EVENT_WEB_INTERFACE_REMOVED",
	EVENT_WEB_RESET:"EVENT_WEB_RESET",
	
	EVENT_UI_REMOVE:"EVENT_UI_REMOVE"
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
