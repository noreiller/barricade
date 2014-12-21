module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')

		, jshint: {
			all: [
				'Gruntfile.js'
				, 'src/scripts/**/*.js'
				, '!src/scripts/polyfill.*'
			]
			, options: {
				laxbreak: true
				, laxcomma: true
				, smarttabs: true
			}
		}

		, less: {
			main: {
				options: {
					paths: ["src/styles"]
					, yuicompress: true
				}
				, files: {
					"dist/css/styles.css": [
						"node_modules/normalize.css/normalize.css"
						, "src/styles/main.less"
					]
				}
			}
		}

		, autoprefixer: {
			dev: {
				expand: true
				, src: 'dist/css/styles.css'
			}
			, prod: {
				expand: false
				, src: 'dist/css/styles.css'
			}
		}

		, copy: {
			scripts: {
				files: [
					{ expand: true, cwd: 'src/scripts', src: ['**'], dest: 'dist/js' }
					, { expand: true, cwd: 'src/templates', src: ['**'], dest: 'dist/templates' }
				]
			}
			, requirejs: {
				files: [
					{ expand: true, cwd: 'node_modules/requirejs', src: ['require.js'], dest: 'dist/js' }
				]
			}
			, templates: {
				files: [
					{ expand: true, cwd: 'src', src: ['*.html'], dest: 'dist', flatten: true }
				]
			}
			, medias: {
				files: [
					{ expand: true, cwd: 'src/fonts', src: ['**'], dest: 'dist/fonts' }
					, { expand: true, cwd: 'src/medias', src: ['**'], dest: 'dist/medias' }
				]
			}
		}

		, replace: {
			templates: {
				options: {
					variables: {
						'data-main="js/config.js"': 'data-main="js/app.js"'
						, '../node_modules/requirejs': 'js'
					}
					, prefix: ''
				}
				, files: [
					{ expand: true, cwd: 'dist', src: ['*.html'], dest: 'dist', flatten: true }
				]
			}
		}

		, requirejs: {
			app: {
				options: {
					baseUrl : "src/scripts"
					, mainConfigFile: "src/scripts/config.js"
					, out: "dist/js/app.js"
					, name: "app"
					, optimizeCss: "none"
					, preserveLicenseComments : true
					, fileExclusionRegExp: /^\./
					, optimize: 'uglify2'
					, useStrict: true
				}
			}
		}

		, clean: {
			dist: ['dist']
		}

		, watch: {
			jshint: {
				files: [
					"Gruntfile.js"
				]
				, tasks: ['jshint']
			}
			, scripts: {
				files: [
					"src/scripts/**/*.js"
					, "src/**/*.html"
				]
				, tasks: ['jshint', 'copy:scripts', 'copy:templates']
			}
			, styles: {
				files: [
					"src/styles/*.less"
				]
				, tasks: ['less', 'autoprefixer:dev']
			}
			, medias: {
				files: [
					"src/medias/*"
				]
				, tasks: ['copy:medias']
			}
		}
		, 'gh-pages': {
			options: {
				base: 'dist'
			}
			, src: ['**']
		}
	});

	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-requirejs');

	grunt.registerTask('build', ['jshint', 'clean', 'less']);
	grunt.registerTask('copy:dev', ['copy:templates', 'copy:medias', 'copy:scripts']);
	grunt.registerTask('copy:prod', ['copy:templates', 'copy:medias', 'copy:requirejs']);

	grunt.registerTask('dev', ['build', 'autoprefixer:dev', 'copy:dev', 'watch']);
	grunt.registerTask('prod', ['build', 'autoprefixer:prod', 'copy:prod', 'replace', 'requirejs']);
	grunt.registerTask('publish', ['prod', 'gh-pages']);

	grunt.registerTask('default', ['build']);
};
