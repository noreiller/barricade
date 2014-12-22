(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, '../tools/tools'
		, '../game/game.events'
		, '../game/game.user'
		, '../views/view.abstract'
		, 'text!../../templates/end.html'
	], function (_, Backbone, Tools, Events, User, AbstractView, endTpl) {
		'use strict';

		var View = AbstractView.extend({
			template: _.template(endTpl)

			, render: function () {
				this.empty();

				var text = this.model.get('turn') === User.storage.get('turn')
					? 'game_player_wins_self'
					: 'game_over'
				;

				this.el.innerHTML = this.template(_.extend(User.storage.toJSON(), {
					label: Tools.getI18n.call(Tools, text)
				}));

				return this;
			}
		});

		return View;
	});

})(window, document);
