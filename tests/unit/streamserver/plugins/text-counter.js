Echo.Tests.Units.push(function(callback) {
	Echo.require([
		"jquery",
		"loadFrom![echo/streamserver.sdk]echo/streamserver/bundled-apps/submit/plugins/text-counter"
	], function($) {

	"use strict";

	var plugin = "Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.TextCounter";

	Echo.Tests.module(plugin, {
		"meta": {
			"className": plugin
		}
	});

	Echo.Tests.pluginRenderersTest(plugin, {
		"targetURL": "http://example.com/js-sdk/"
	});
	callback();
	});
});
