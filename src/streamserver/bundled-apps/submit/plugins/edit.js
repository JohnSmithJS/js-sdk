Echo.define([
	"jquery",
	"loadFrom![echo/apps.sdk]echo/plugin",
	"loadFrom![echo/apps.sdk]echo/utils"
], function($, Plugin, Utils) {

"use strict";

/**
 * @class Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.Edit
 * Adds new mode to the Echo Submit application which allows
 * to edit the content and some metadata of the item.
 *
 * 	new Echo.StreamServer.BundledApps.Submit.ClientWidget({
 * 		"target": document.getElementById("echo-submit"),
 * 		"appkey": "echo.jssdk.demo.aboutecho.com",
 * 		"plugins": [{
 * 			"name": "Edit"
 * 		}]
 * 	});
 *
 * @extends Echo.Plugin
 *
 * @private
 * @package streamserver.pack.js
 */
var plugin = Plugin.definition("Edit", "Echo.StreamServer.BundledApps.Submit.ClientWidget");

plugin.init = function() {
	this.extendTemplate("insertAfter", "postContainer", plugin.templates.cancel);
	this.extendTemplate("replace", "header", plugin.templates.header);
	this.component.labels.set({
		"post": this.labels.get("post"),
		"posting": this.labels.get("posting")
	});
};

plugin.labels = {
	/**
	 * @echo_label
	 */
	"createdBy": "Created by",
	/**
	 * @echo_label
	 */
	"edit": "Edit",
	/**
	 * @echo_label
	 */
	"on": "on",
	/**
	 * @echo_label
	 */
	"post": "Update",
	/**
	 * @echo_label
	 */
	"posting": "Updating...",
	/**
	 * @echo_label
	 */
	"cancel": "cancel"
};

/**
 * @echo_event Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.Edit.onEditInit
 * Triggered when edit operation was started
 */
/**
 * @echo_event Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.Edit.onEditComplete
 * Triggered when edit operation is finished
 */
/**
 * @echo_event Echo.StreamServer.BundledApps.Submit.ClientWidget.Plugins.Edit.onEditError
 * Triggered if edit operation failed
 */
$.map(["Init", "Complete", "Error"], function(action) {
	plugin.events["Echo.StreamServer.BundledApps.Submit.ClientWidget.onPost" + action] = function(topic, args) {
		if (action === "Init") {
			args.postData.content = this._prepareContent();
		}
		this.events.publish({
			"data": args,
			"topic": "onEdit" + action
		});
	};
});

/**
 * @echo_template
 */
plugin.templates.header =
	'<div class="{plugin.class:header} echo-primaryFont echo-primaryFont echo-primaryColor">' +
		'{plugin.label:createdBy} <span class="{plugin.class:author}"></span> ' +
		'{plugin.label:on} <span class="{plugin.class:editedDate}"></span>' +
	'</div>';

/**
 * @echo_template
 */
plugin.templates.cancel =
	'<div class="{plugin.class:cancelButtonContainer}">' +
		'<a href="javascript:void(0);" class="{plugin.class:cancelButton} echo-primaryFont echo-clickable echo-linkColor">' +
			'{plugin.label:cancel}' +
		'</a>' +
	'</div>';

/**
 * @echo_renderer
 */
plugin.renderers.author = function(element) {
	var component = this.component;
	return element.text(component.get("data.actor.title") || component.labels.get("guest"));
};

/**
 * @echo_renderer
 */
plugin.renderers.editedDate = function(element) {
	var published = this.component.get("data.object.published");
	if (!published) return element.empty();

	var date = new Date(Utils.timestampFromW3CDTF(published) * 1000);
	return element.text(date.toLocaleDateString() + ', ' + date.toLocaleTimeString());
};

/**
 * @echo_renderer
 */
plugin.renderers.cancelButton = function(element) {
	var plugin = this;
	return element.click(function() {
		plugin.events.publish({"topic": "onEditError"});
	});
};

plugin.methods._prepareContent = function() {
	var submit = this.component;
	var get = function(name){
		return submit.view.get(name).val();
	};
	return [].concat(this._getMetaDataUpdates("tag", "tag", get("tags")),
			 this._getMetaDataUpdates("mark", "marker", get("markers")),
			 this._prepareActivity("update", "comment", get("text")));
};

plugin.methods._prepareActivity = function(verb, type, data) {
	return (!data) ? [] : {
		"object": {
			"objectTypes": ["http://activitystrea.ms/schema/1.0/" + type],
			"content": data
		},
		"source": this.component.config.get("source"),
		"verbs": ["http://activitystrea.ms/schema/1.0/" + verb],
		"targets": [{
			"id": this.component.get("data.object.id")
		}]
	};
};

plugin.methods._getMetaDataUpdates = function(verb, type, data) {
	var plugin = this, component = this.component;
	var extract = function(value) {
		return $.map(value || [], function(item) { return $.trim(item); });
	};
	var items = {
		"modified": extract(data.split(",")),
		"current": extract(component.get("data.object." + type + "s"))
	};
	var updates = [];
	var diff = function(a, b, verb) {
		$.map(a, function(item) {
			if (item && !~$.inArray(item, b)) {
				updates.push(plugin._prepareActivity(verb, type, item));
			}
		});
	};
	diff(items.current, items.modified, "un" + verb);
	diff(items.modified, items.current, verb);
	return updates;
};

plugin.css = 
	'.{plugin.class:cancelButtonContainer} { float: right; margin: 6px 15px 0px 0px; }';

return Plugin.create(plugin);

});
