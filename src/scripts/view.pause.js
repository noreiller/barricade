(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'tools'
		, 'game.events'
		, 'game.user'
		, 'view.abstract'
		, 'text!../templates/pause.html'
	], function (_, Backbone, Tools, Events, User, AbstractView, pauseTpl) {
		'use strict';

		var View = AbstractView.extend({
			template: _.template(pauseTpl)

			, render: function () {
				this.empty();

				this.el.innerHTML = this.template(User.storage.toJSON());

				return this;
			}
		});

		return View;
	});

})(window, document);
