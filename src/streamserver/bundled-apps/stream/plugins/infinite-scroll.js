Echo.define([
	"jquery",
	"echo/plugin"
], function($, Plugin) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Stream.ClientWidget.Plugins.InfiniteScroll
 * Echo Stream plugin automatically loads the next page full of items
 * when the end of the stream is displayed in the browser.
 * This produces the 'Infinite Scroll' Effect.
 *
 * 	new Echo.StreamServer.BundledApps.Stream.ClientWidget({
 * 		"target": document.getElementById("echo-stream"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "InfiniteScroll"
 * 		}]
 * 	});
 *
 * More information regarding the plugins installation can be found
 * in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-plugins) guide.
 *
 * @extends Echo.Plugin
 *
 * @package streamserver.pack.js
 */
var plugin = Plugin.definition("InfiniteScroll", "Echo.StreamServer.BundledApps.Stream.ClientWidget");

if (Plugin.isDefined(plugin)) return;

plugin.init = function() {
	var plugin = this;
	var handler = function(event) {
		var element = plugin.component.view.get("more");
		if (element && !plugin.get("requestInProgress") &&
			$.inviewport(element, {"threshold": 0})) {
				plugin.set("requestInProgress", true);
				element.click();
		}
	};
	plugin.set("scrollHandler", handler);
	$(window).on("scroll", handler);
};

plugin.events = {
	"Echo.StreamServer.BundledApps.Stream.ClientWidget.onDataReceive": function(topic, args) {
		this.set("requestInProgress", false);
	}
};

plugin.methods.destroy = function() {
	$(window).off("scroll", this.get("scrollHandler"));
};

return Plugin.create(plugin);

});