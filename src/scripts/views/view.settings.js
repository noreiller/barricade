(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, '../tools/tools'
		, '../game/game.events'
		, '../game/game.user'
		, '../views/view.abstract'
		, 'text!../../templates/settings.html'
	], function (_, Backbone, Tools, Events, User, AbstractView, settingsTpl) {
		'use strict';

		var View = AbstractView.extend({
			template: _.template(settingsTpl)

			, render: function () {
				this.empty();

				this.el.innerHTML = this.template({
					i18n: User.storage.get('dict')
					, languages: User.storage.get('languages')
				});

				return this;
			}
		});

		return View;
	});

})(window, document);
