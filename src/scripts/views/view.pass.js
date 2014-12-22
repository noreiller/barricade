(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, '../tools/tools'
		, '../views/view.control'
		, '../game/game.user'
		, '../game/game.events'
	], function (_, Backbone, Tools, ControlView, User, Events) {
		'use strict';

		var View = ControlView.extend({
			className: 'pass-component control-component'

			, initialize: function (options) {
				ControlView.prototype.initialize.apply(this, arguments);

				_.bindAll(this, 'render', 'check');

				this.listenTo(Events, 'game:turn', this.check);

				this.insertElement();
				this.render();

				return this;
			}

			, check: function (playerInfos) {
				if (User.storage.get('value') !== playerInfos.value) {
					this.hide();
				}
				else {
					this.show();
				}

				return this;
			}
		});

		return View;
	});

})(window, document);
