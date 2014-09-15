(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'tools'
		, 'game.events'
		, 'view.abstract'
	], function (_, Backbone, Tools, Events, AbstractView) {
		'use strict';

		var View = AbstractView.extend({
			el: window

			, events: {
				'resize': 'resize'
			}

			, initialize: function (options) {
				_.bindAll(this, 'resize');
				this.initializeRequestAnimFrame();

				return this;
			}

			, initializeRequestAnimFrame: function () {
				window.requestAnimFrame = (function(callback) {
					return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
						window.setTimeout(callback, 1000 / 60);
					};
				})();

				return this;
			}

			, resize: function () {
				window.clearTimeout(this.resizeTimeout);

				this.resizeTimeout = window.setTimeout(function () {
					Events.trigger('window:resize');
				}, 50);

				return this;
			}
		});

		return View;
	});

})(window, document);
