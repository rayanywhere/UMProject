var Notification = {
	EVENT_EDITOR_SWITCHED:"EVENT_EDITOR_SWITCHED",
	EVENT_DATA_NAMESPACE_ADDED:"EVENT_DATA_NAMESPACE_ADDED",
	EVENT_DATA_OBJECT_ADDED:"EVENT_DATA_OBJECT_ADDED",
	EVENT_DATA_CONSTANT_ADDED:"EVENT_DATA_CONSTANT_ADDED",
	EVENT_DATA_ATTRIBUTE_ADDED:"EVENT_DATA_ATTRIBUTE_ADDED",
	EVENT_DATA_NAMESPACE_REMOVED:"EVENT_DATA_NAMESPACE_REMOVED",
	EVENT_DATA_OBJECT_REMOVED:"EVENT_DATA_OBJECT_REMOVED",
	EVENT_DATA_CONSTANT_REMOVED:"EVENT_DATA_CONSTANT_REMOVED",
	EVENT_DATA_ATTRIBUTE_REMOVED:"EVENT_DATA_ATTRIBUTE_REMOVED",
	EVENT_DATA_RESET:"EVENT_DATA_RESET"
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
