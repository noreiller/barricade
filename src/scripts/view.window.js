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
