(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'tools'
		, 'game.events'
		, 'game.user'
		, 'view.board'
		, 'view.controls'
		, 'view.notification'
		, 'view.window'
		, 'view.dice'
		, 'view.turn'
		, 'view.panel'
		, 'view.menu'
		, 'view.pass'
	], function (_, Backbone, Tools, Events, User, BoardView, ControlsView, NotificationView, WindowView, DiceView, TurnView, PanelView, MenuView, PassView) {
		'use strict';

		var UI = {};

		UI.render = function () {
			this._views = new Backbone.ChildViewContainer();

			this._views.add(new WindowView(), 'window');

			this._views.add(new BoardView({
				collection: this._places
				, id: 'board'
			}), 'board');

			this._views.add(new DiceView({
				model: this._settings
				, id: 'dice'
			}), 'dice');

			this._views.add(new TurnView({
				model: this._settings
				, id: 'turn'
			}), 'turn');

			this._views.add(new PassView({
				model: this._controls.findWhere({ name: 'pass' })
				, id: 'pass'
			}), 'pass');

			this._views.add(new MenuView({
				model: this._controls.findWhere({ name: 'menu' })
				, id: 'menu'
			}), 'menu');

			this._views.add(new NotificationView({
				id: 'notification'
			}), 'notification');

			this._views.add(new PanelView({
				id: 'panel'
			}), 'panel');

			// The game is loaded
			document.body.classList.add('loaded');

			return this;
		};

		UI.updateRendering = function () {
			if (!this._settings.get('noui')) {
				try {
					User.storage.set({
						mapRowCount: this._settings.get('rows')
						, mapColCount: this._settings.get('cols')
					});

					this._views.findByCustom('board').render();
				}
				catch (e) {
					Events.trigger('game:error', e);
				}
			}

			return this;
		};

		UI.resetRendering = function () {
			if (!this._settings.get('noui')) {
				try {
					User.storage.set({
						mapRowCount: 0
						, mapColCount: 0
					});

					// reset views
					this._views.findByCustom('board').reset();
					this._views.findByCustom('notification').reset();
				}
				catch (e) {
					Events.trigger('game:error', e);
				}
			}

			return this;
		};

		return UI;
	});

})(window, document);
