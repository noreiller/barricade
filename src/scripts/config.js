require.config({
	deps: ['app']
	, paths: {
		'jquery': '../../node_modules/backbone.babysitter/public/javascripts/jquery'
		, 'jquery.requestAnimationFrame': '../../node_modules/jquery.requestAnimationFrame/dist/jquery.requestAnimationFrame'
		, 'underscore': '../../node_modules/underscore/underscore'
		, 'backbone': '../../node_modules/backbone/backbone'
		, 'backbone.babysitter': '../../node_modules/backbone.babysitter/lib/backbone.babysitter.min'
		, 'randomcolor': '../../node_modules/randomcolor/randomColor'
		, 'easystar': '../../node_modules/easystarjs/bin/easystar-0.1.13'
		, 'text': '../../node_modules/text/text'
		, 'easing-js': '../../node_modules/easing-js/easing'
		, 'localforage': '../../node_modules/localforage/dist/localforage'
		// THREE: '../../bower_components/threejs/build/three'
		// , OrbitControls: '../../bower_components/threejs/examples/js/controls/OrbitControls'
	}
	, shim: {
		'backbone': {
			deps: ['underscore', 'jquery']
		}
		, 'backbone.babysitter': {
			deps: ['backbone']
		}
		, 'jquery.requestAnimationFrame': {
			deps: ['jquery']
		}
		, 'localforage-backbone': {
			deps: ['localforage']
		}
		// , THREE: {
		// 	exports: 'THREE'
		// }
		// , OrbitControls: {
		// 	deps: ['THREE']
		// 	, exports: 'THREE.OrbitControls'
		// }
	}
});
