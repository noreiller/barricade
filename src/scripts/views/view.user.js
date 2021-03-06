(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, '../tools/tools'
		, '../game/game.events'
		, '../game/game.user'
		, '../views/view.abstract'
		, 'text!../../templates/user.html'
	], function (_, Backbone, Tools, Events, User, AbstractView, userTpl) {
		'use strict';

		var View = AbstractView.extend({
			template: _.template(userTpl)

			, render: function () {
				this.empty();

				this.el.innerHTML = this.template(User.storage.toJSON());

				return this;
			}
		});

		return View;
	});

})(window, document);
