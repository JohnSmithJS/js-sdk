define("echo/streamserver/apps/counter", [
	"jquery",
	"echo/app",
	"echo/utils",
	"echo/streamserver/api"
], function($, App, Utils, API) {
"use strict";

/**
 * @class Echo.StreamServer.Apps.Counter
 * Echo Counter class which encapsulates interaction with the
 * <a href="http://wiki.aboutecho.com/w/page/27888212/API-method-count" target="_blank">Echo Count API</a>
 * and provides a simple live updating number.
 *
 * 	new Echo.StreamServer.Apps.Counter({
 * 		"target": document.getElementById("echo-counter"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"query" : "childrenof:http://example.com/test/*"
 * 	});
 *
 * More information regarding the possible ways of the Application initialization
 * can be found in the [“How to initialize Echo components”](#!/guide/how_to_initialize_components-section-initializing-an-app) guide.
 *
 * @extends Echo.App
 *
 * @package streamserver/apps.pack.js
 * @package streamserver.pack.js
 *
 * @constructor
 * Counter constructor initializing Echo.StreamServer.Apps.Counter class
 *
 * @param {Object} config
 * Configuration options
 */
var counter = App.manifest("Echo.StreamServer.Apps.Counter");

if (App.isDefined(counter)) return;

/** @hide @cfg labels */
/** @hide @method getPlugin */
/** @hide @method parentRenderer */

/**
 * @echo_event Echo.StreamServer.Apps.Counter.onReady
 * Triggered when the app initialization is finished completely.
 */
/**
 * @echo_event Echo.StreamServer.Apps.Counter.onRefresh
 * Triggered when the app is refreshed. For example after the user
 * login/logout action or as a result of the "refresh" function call.
 */
/**
 * @echo_event Echo.StreamServer.Apps.Counter.onRender
 * Triggered when the app is rendered.
 */
/**
 * @echo_event Echo.StreamServer.Apps.Counter.onRerender
 * Triggered when the app is rerendered.
 */

counter.init = function() {
	if (!this.config.get("appkey")) {
		return Utils.showError({
			"errorCode": "incorrect_appkey",
			"label": this.labels.get("error_incorrect_appkey")
		}, {
			"critical": true,
			"target": this.config.get("target")
		});
	}

	// picking up timeout value for backwards compatibility
	var timeout = this.config.get("liveUpdates.timeout");
	if (typeof timeout !== "undefined") {
		this.config.set("liveUpdates.polling.timeout", timeout);
	}

	this.request = this._getRequestObject();
	if ($.isEmptyObject(this.get("data"))) {
		this.request.send();
	} else {
		this.render();
		this.ready();
		if (this.request) {
			this.request.send({
				"skipInitialRequest": true
			});
		}
	}
};

counter.config = {
	/**
	 * @cfg {String} appkey
	 * Specifies the customer application key. You should specify this parameter
	 * if your application uses StreamServer or IdentityServer API requests.
	 * You can use the "echo.jssdk.demo.aboutecho.com" appkey for testing purposes.
	 */
	"appkey": "",

	/**
	 * @cfg {String} apiBaseURL
	 * URL prefix for all API requests
	 */
	"apiBaseURL": "{%=baseURLs.api.streamserver%}/v1/",
	/**
	 * @cfg {String} query
	 * Specifies the search query to generate the necessary data set.
	 * It must be constructed according to the
	 * <a href="http://wiki.aboutecho.com/w/page/23491639/API-method-search" target="_blank">"search" API</a>
	 * method specification.
	 *
	 * 	new Echo.StreamServer.Apps.Counter({
	 * 		"target": document.getElementById("echo-counter"),
	 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
	 * 		"query" : "childrenof:http://example.com/test/*"
	 * 	});
	 */
	"query": "",
	/**
	 * @cfg {Object} data
	 * Specifies predefined items count which should be displayed by the application.
	 * Counter application works with the data format used by the "count" API endpoint.
	 * More information about the data format can be found
	 * <a href="http://wiki.aboutecho.com/w/page/27888212/API-method-count#ResponseFormat" target="_blank">here</a>.
	 *
	 * 	new Echo.StreamServer.Apps.Counter({
	 * 		...
	 * 		"data": {"count": 100},
	 * 		...
	 * 	});
	 */
	"data": undefined,

	/**
	 * @cfg {Object} [liveUpdates]
	 * Live updating machinery configuration (only the "polling" transport
	 * is supported for the "count" API endpoint).
	 *
	 * @cfg {Boolean} [liveUpdates.enabled=true]
	 * Parameter to enable/disable live updates.
	 *
	 * @cfg {Object} [liveUpdates.polling]
	 * Object which contains the configuration specific to the "polling"
	 * live updates transport.
	 *
	 * @cfg {Number} [liveUpdates.polling.timeout=10]
	 * Timeout between the live updates requests (in seconds).
	 */
	"liveUpdates": {
		"enabled": true,
		"polling": {
			"timeout": 10
		}
	},
	/**
	 * @cfg {Boolean} useSecureAPI
	 * This parameter is used to specify the API request scheme.
	 * If parameter is set to false or not specified, the API request object
	 * will use the scheme used to retrieve the host page.
	 */
	"useSecureAPI": false
};

counter.templates.main = "<span>{data:count}</span>";

counter.methods._getRequestObject = function(overrides) {
	return API.request(
		$.extend(true, {
			"endpoint": "count",
			"data": {
				"q": this.config.get("query"),
				"appkey": this.config.get("appkey")
			},
			"liveUpdates": this.config.get("liveUpdates"),
			"secure": this.config.get("useSecureAPI"),
			"apiBaseURL": this.config.get("apiBaseURL"),
			"onError": $.proxy(this._error, this),
			"onData": $.proxy(this._handleResponse, this)
		}, overrides)
	);
};

counter.methods._maybeUpdate = function(data) {
	if ($.isEmptyObject(this.data) || this.data.count != data.count) {
		/**
		 * @echo_event Echo.StreamServer.Apps.Counter.onUpdate
		 * Triggered when new value is received.
		 */
		this.events.publish({
			"topic": "onUpdate",
			"data": {
				"data": data,
				"query": this.config.get("query"),
				"target": this.config.get("target").get(0)
			}
		});
		this.set("data", data);
		this.render();
	}
};

counter.methods._handleResponse = function(data, options) {
	this._maybeUpdate(data);
	if (options.requestType === "initial") {
		this.ready();
	}
};

counter.methods._error = function(data, options) {
	/**
	 * @echo_event Echo.StreamServer.Apps.Counter.onError
	 * Triggered when some error has occured while getting counter data.
	 */
	this.events.publish({
		"topic": "onError",
		"data": {
			"data": data,
			"query": this.config.get("query"),
			"target": this.config.get("target").get(0)
		}
	});
	if (data.errorCode === "more_than") {
		this.set("data.count", data.errorMessage + "+");
		this.render();
	} else {
		if (typeof options.critical === "undefined" || options.critical || options.requestType === "initial") {
			Utils.showMessage({
				"type": "error",
				"data": data,
				"message": data.errorMessage,
				"target": this.config.get("target")
			});
		}
	}
	this.ready();
};

return App.create(counter);

});
