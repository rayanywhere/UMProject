var Editor = {
	root:false,
	init: function() {
		NotificationCenter.addObserver(Editor);
		Editor.root = $("#editor");

		Editor.root.find(">.droppable").droppable({accept:"#toolbar .widget",hoverClass:"ui-state-highlight", drop: Editor._onDrop});
		Editor.show(null);
	},
	_onDrop: function(ui, evt) {
		if (evt.draggable.hasClass("version")) {
			Editor.show("version");
		}
		else if (evt.draggable.hasClass("interface")) {
			Editor.show("interface");
		}
	},
	show:function(editorName) {
		Editor.root.find(">div:eq(0)>div").hide();
		Editor.root.find(">h1:eq(0)>div").removeClass("version").removeClass("interface");
		if (editorName) {
			Editor.root.find(">div:eq(0)>div." + editorName).show();
			Editor.root.find(">h1:eq(0)>span").text(editorName.charAt(0).toUpperCase() + editorName.slice(1));
			Editor.root.find(">h1:eq(0)>div").addClass(editorName);
			Editor.root.find(">div:eq(0)").removeClass("empty");
			switch(editorName) {
				case "interface":
					Editor.Interface.init();
					break;
				case "version":
					Editor.Version.init();
					break;
			}
		}
		else {
			Editor.root.find(">h1:eq(0)>span").text("Getting Started");
			Editor.root.find(">h1:eq(0)>div").removeClass("version").removeClass("interface");
			Editor.root.find(">div:eq(0)").addClass("empty");
		}
	},
	Version : {
		root: false,
		init: function() {
			Editor.Version.root = Editor.root.find(">div:eq(0)>div.version");
			Editor.Version.root.find("input:text").val("");
			Editor.Version.root.find("textarea").val("");
		},
		getData: function() {
			var name = Editor.Version.root.find("input:text").val();
			var comment = Editor.Version.root.find("textarea").val();

			if (name.length == 0) {
				alert("name field cannot be left empty");
				return false;
			}
			return new UMWeb.Version(name, comment, []);
		}
	},
	Interface : {
		root: false,
		init: function() {
			Editor.Interface.root = Editor.root.find(">div:eq(0)>div.interface");
			Editor.Interface.root.find("textarea").val("");
			Editor.Interface.root.find("li:eq(9) div").droppable({accept:"#tree .widget.object", hoverClass:"ui-state-highlight", drop: Editor.Interface._onDrop});
		},
		_onDrop: function(ui, evt) {
			var components = evt.draggable.parent().next().attr("id").split("_");
            var namespace = Data.findNamespace(components[1]);
			var object = Data.findObject(namespace, components[2]);

			$(ui.target).text(namespace.name + "." + object.name);
			$(ui.target).removeClass("empty");
		},
		getData: function() {
			var name = Editor.Interface.root.find("li:eq(1) input").val();
			var comment = Editor.Interface.root.find("li:eq(3) textarea").val();
			var protocol = Editor.Interface.root.find("li:eq(5) input:eq(0)").val();
			var host = Editor.Interface.root.find("li:eq(5) input:eq(1)").val();
			var port = parseInt(Editor.Interface.root.find("li:eq(5) input:eq(2)").val()) || 0;
			var timeout = parseInt(Editor.Interface.root.find("li:eq(7) input").val()) || 0;
			var request = Editor.Interface._parseObjectReference(Editor.Interface.root.find("li:eq(9) div:eq(0)"));
			var response = Editor.Interface._parseObjectReference(Editor.Interface.root.find("li:eq(9) div:eq(1)"));
			if (name.length == 0) {
				alert("name field cannot be left empty");
				return false;
			}
			if ((protocol.length == 0) || (host.length == 0)) {
				alert("address field cannot be left empty");
				return false;
			}
			if (!request || !response) {
				alert("request / response field cannot be left empty");
				return false;
			}

			return new UMWeb.Interface(name, comment, protocol, host, port, timeout, request, response);
	    },
		_parseObjectReference: function(target) {
			var target = target.text().split('.');
			if (target.length != 2) {
				return false;
			}
			return {namespace:target[0], object:target[1]};
		}
	}
};
