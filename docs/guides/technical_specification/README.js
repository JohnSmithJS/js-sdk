Ext.data.JsonP.technical_specification({
  "guide": "<h1 id='technical_specification-section-technical-specification'>Technical Specification</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/technical_specification-section-overview'>Overview</a></li>\n<li><a href='#!/guide/technical_specification-section-limitations'>Limitations</a></li>\n<li><a href='#!/guide/technical_specification-section-fault-tolerant-jquery-support'>Fault tolerant jQuery support</a></li>\n<li><a href='#!/guide/technical_specification-section-browser-support'>Browser support</a></li>\n</ol>\n</div>\n\n<h2 id='technical_specification-section-overview'>Overview</h2>\n\n<p>This document contains technical limitations, browser support of the JS SDK and will soon include a more detailed accounting of the design principles and technology choices of the SDK.</p>\n\n<h2 id='technical_specification-section-limitations'>Limitations</h2>\n\n<h3 id='technical_specification-section-quirks-browser-mode-is-not-supported'>Quirks browser mode is not supported</h3>\n\n<p>Key components used in the SDK (such as Bootstrap UI Framework and Isotope library, which we use for Pinboard visualization plugin) do not support the quirks mode, so we decided to decline the quirks mode support as well. The SDK will still be functioning in quirks mode but some of the features will not be available and the UI components might not be rendered properly. More information about the quirks browser mode can be found <a href=\"http://en.wikipedia.org/wiki/Quirks_mode\">here</a>.</p>\n\n<h2 id='technical_specification-section-fault-tolerant-jquery-support'>Fault tolerant jQuery support</h2>\n\n<p>Echo JS SDK uses its own instance of jQuery to isolate SDK code execution from the other code on the page and vice versa. It also helps to prevent jQuery version conflicts. This instance is namespaced as <em>Echo.jQuery</em>. Its version is regularly updated, usually within a few weeks since the jQuery official release date. The actual version used in production code can be found in the <a href=\"https://github.com/EchoAppsTeam/js-sdk/blob/master/Changelog.md\">SDK changelog</a>.</p>\n\n<p>At the moment Echo SDK includes only 2 jQuery plugins: <em>isotope</em> and <em>viewport</em>. Their code is wrapped using the method described <a href=\"#!/guide/terminology-section-3\">here</a> to use Echo instance of jQuery. Nothing on the page will be able to interact with these exact plugins unless it uses Echo.jQuery.</p>\n\n<p>If third-party application built on top of this SDK utilizes some other jQuery plugins it should do one of the following:</p>\n\n<ul>\n<li>use the plugin as is but make sure that some jQuery instance is used on the page;</li>\n<li>put a copy of the plugin into its codebase and wrap it with the <a href=\"#!/guide/terminology-section-3\">Echo wrapper</a>.</li>\n</ul>\n\n\n<h2 id='technical_specification-section-browser-support'>Browser support</h2>\n\n<p>Echo JS SDK is tested against new non-beta versions of the browsers listed below (within 2 weeks of their respective official release dates):</p>\n\n<ul>\n<li>Firefox (latest version) on Windows and Mac OS X</li>\n<li>Safari (latest version) on Windows and Mac OS X</li>\n<li>Chrome (latest version) on Windows and Mac OS X</li>\n<li>Internet Explorer 8, 9 and 10 on Windows</li>\n<li>Mobile Safari on iPad and iPhone</li>\n<li>Native Browser on Android 4+ version</li>\n</ul>\n\n",
  "title": "Technical specification"
});