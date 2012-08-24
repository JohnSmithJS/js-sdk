/*global module:false*/
module.exports = function(grunt) {

	var _ = grunt.utils._;
	var _dirs = {
		src: "src",
		dest: "web/sdk",
		tests: "tests"
	};
	var _dontWrap = [
		_dirs.src + "/backplane.js",
		_dirs.src + "/loader.js",
		_dirs.src + "/third-party/jquery.js",
		_dirs.src + "/third-party/echo.jquery.noconflict.js"
	];
	var _dontStripDocs = grunt.file.expandFiles(_dirs.src + "/third-party/*.js");
	var _config = {
		dirs: _dirs,
		pkg: "<json:js-sdk.json>",
		meta: {
			banner:
				"/**\n" +
				" * Copyright (c) 2006-<%= grunt.template.today(\"UTC:yyyy\") %> <%= pkg.author.name %> <<%= pkg.author.email %>>. All rights reserved.\n" +
				" * You may copy and modify this script as long as the above copyright notice,\n" +
				" * this condition and the following disclaimer is left intact.\n" +
				" * This software is provided by the author \"AS IS\" and no warranties are\n" +
				" * implied, including fitness for a particular purpose. In no event shall\n" +
				" * the author be liable for any damages arising in any way out of the use\n" +
				" * of this software, even if advised of the possibility of such damage.\n" +
				" *\n" +
				" * Version: <%= pkg.version %> (<%= grunt.template.today(\"UTC:yyyy-mm-dd HH:MM:ss Z\") %>)\n" +
				" */"
		},
		clean: {
			docs: ["<%= dirs.dest %>/docs"],
			all: ["<%= dirs.dest %>"]
		},
		exec: {
			docs: {
				command: "jsduck src --ignore-global --title=\"Echo JS SDK\" --pretty-json --output web/sdk/docs"
						//	jsduck src --ignore-global --title="Echo JS SDK" --pretty-json --output web/sdk/docs --meta-tags=tools/jsduck.tags.rb
			}
		},
		copy: {
			js: {
				files: {
					"<%= dirs.dest %>": ["<%= dirs.src %>/**/*.js"]
				},
				options: {
					basePath: _dirs.src,
					processContent: function(code) {
						return grunt.helper("wrap_code", grunt.helper("strip_docs", code));
					},
					processContentExclude: _dontWrap
				}
			},
			"images-css": {
				files: {
					"<%= dirs.dest %>": [
						"<%= dirs.src %>/**/*.css",
						"<%= dirs.src %>/**/*.png",
						"<%= dirs.src %>/**/*.jpg",
						"<%= dirs.src %>/**/*.gif"
					]
				},
				options: {
					basePath: _dirs.src
				}
			},
			tests: {
				files: {
					"<%= dirs.dest %>": ["<%= dirs.tests %>/**/*"]
				}
			}
		},
		concat: {
			loader: {
				src: [
					"<banner:meta.banner>",
					"<%= dirs.src %>/third-party/yepnope.1.5.4-min.js",
					"<%= dirs.src %>/loader.js"
				],
				dest: "<%= dirs.dest %>/loader.js"
			}
		},
		packs: {
			"api": [
				"<%= dirs.src %>/api.js",
				"<%= dirs.src %>/stream-server/api.js",
				"<%= dirs.src %>/identity-server/api.js"
			],
			"environment": [
				"<%= dirs.src %>/utils.js",
				"<%= dirs.src %>/events.js",
				"<%= dirs.src %>/labels.js",
				"<%= dirs.src %>/configuration.js",
				"<file_strip_banner:<%= dirs.dest %>/api.pack.js>",
				"<%= dirs.src %>/user-session.js",
				"<%= dirs.src %>/control.js",
				"<%= dirs.src %>/product.js",
				"<%= dirs.src %>/plugin.js",
				"<%= dirs.src %>/button.js",
				"<%= dirs.src %>/tabs.js"
			],
			"third-party/jquery": [
				"<%= dirs.src %>/third-party/jquery.js",
				"<%= dirs.src %>/third-party/echo.jquery.noconflict.js",
				"<%= dirs.src %>/third-party/jquery.ihint.js",
				"<%= dirs.src %>/third-party/jquery.viewport.mini.js",
				"<%= dirs.src %>/third-party/jquery.easing-1.3.min.js",
				"<%= dirs.src %>/third-party/jquery.fancybox-1.3.4.min.js",
				"<%= dirs.src %>/third-party/echo.fancybox.css.js",
				"<%= dirs.src %>/third-party/jquery.ui-1.8.21.min.js",
				"<%= dirs.src %>/third-party/jquery.isotope.min.js",
				"<%= dirs.src %>/third-party/bootstrap/bootstrap-tab.js"
			]
		},
		//min: {
		//	all: ["**/*.pack.js"]
		//},
		//qunit: {
		//	files: ["test/**/*.html"]
		//},
		lint: {
			// TODO: exclude third-party and qunit from linting
			// TODO: lint dest dir cause all files there are properly wrapped
			files: [
				"grunt.js",
				"<%= dirs.dest %>/**/*.js",
				"<%= dirs.tests %>/**/*.js"
			]
		},
		//watch: {
		//	files: "<config:lint.files>",
		//	tasks: "lint qunit"
		//},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				Echo: true,
				jQuery: true,
				QUnit: true
			}
		},
		uglify: {}
	};

	_.each(["stream-server", "identity-server", "app-server"], function(name) {
		_config.packs[name + "/controls"] = ["<%= dirs.src %>/" + name + "/controls/*.js"];
		_config.packs[name + "/plugins"] = ["<%= dirs.src %>/" + name + "/plugins/*.js"];
		_config.packs[name] = _config.packs[name + "/controls"].concat(_config.packs[name + "/plugins"]);
	});

	grunt.initConfig(_config);

	// ==========================================================================
	// TASKS
	// ==========================================================================

	grunt.loadNpmTasks("grunt-exec");
	grunt.loadNpmTasks("grunt-contrib");
	grunt.loadTasks("tasks");

	grunt.registerMultiTask("packs", "Assemble packages", function() {
		var name = this.target + ".pack.js";
		grunt.log.write("Assembling \"" + name + "\"...");
		var files = grunt.file.expandFiles(this.file.src);
		var code = grunt.helper("wrap_and_concat", files, this.target);
		code = grunt.template.process(grunt.config("meta.banner")) + "\n" + code;
		grunt.file.write(grunt.config("dirs.dest") + "/" + name, code);

		if (this.errorCount) {
			return false;
		}
		grunt.log.ok();
	});

	grunt.registerTask("docs", "clean:docs exec:docs");

	// Default task
	grunt.registerTask("default", "clean copy concat:loader packs");

	// ==========================================================================
	// HELPERS
	// ==========================================================================

	var _stripDocsRE = /[^\r\n]*\/\*[\s\S]*?\*\/\n/g;
	grunt.registerHelper("strip_docs", function(code, filepath) {
		if (_.include(_dontStripDocs, filepath)) {
			return code;
		}
		return code.replace(_stripDocsRE, function(match) {
			if (/\s+\* @\w/.test(match)) {
				return "";
			}
			return match;
		});
	});

	grunt.registerHelper("wrap_and_concat", function(files, name) {
		if (!files) {
			return "";
		}
		return files.map(function(filepath) {
			var code = grunt.task.directive(filepath, grunt.file.read);
			code = grunt.helper("wrap_code", code, filepath);
			code = grunt.helper("strip_docs", code, filepath);
			return code;
		}).join(grunt.utils.normalizelf(grunt.utils.linefeed));
	});

	grunt.registerHelper("wrap_code", function(code, filepath) {
		if (_.include(_dontWrap, filepath)) {
			return code;
		}
		if (!/third-party|\.pack\.js/.test(filepath)) {
			var doc = code.match(/@class ((?:\w+\.?)+)\s/);
			var docClass = doc && doc[1];
			if (docClass) {
				var parts = docClass.split(".Plugins.");
				// if it's plugin file
				if (parts[1]) {
					// we don't wrap plugin files at the moment because they can have 2 plugins in 1 file
					//code = "var plugin = Echo.Plugin.manifest(\"" + parts[1] + "\", \"" + parts[0] + "\");\n\n" +
					//	"if (Echo.Plugin.isDefined(plugin)) return;\n\n" + code;
				} else {
					code = "if (Echo.Utils.isComponentDefined(\"" + docClass + "\")) return;\n\n" + code;
				}
			} else if (filepath) {
				grunt.log.writeln("File " + filepath + " is missing '@class' definition");
			}
		}
		return "(function(jQuery) {\nvar $ = jQuery;\n\n" + code + "\n})(Echo.jQuery);\n";
	});
};