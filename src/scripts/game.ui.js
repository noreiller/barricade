define([
	'underscore'
	, 'backbone'
	, 'tools'
	, 'game.events'
	, 'view.board'
	, 'view.settings'
	, 'view.controls'
	, 'view.notification'
	, 'view.window'
	, 'view.dice'
	, 'view.turn'
	, 'view.user'
], function (_, Backbone, Tools, Events, BoardView, SettingsView, ControlsView, NotificationView, WindowView, DiceView, TurnView, UserView) {
	'use strict';

	var UI = {};

	UI.render = function () {
		this._views = new Backbone.ChildViewContainer();

		this._views.add(new SettingsView({
			model: this._settings
			, el: '#settings'
		}), 'settings');

		this._views.add(new DiceView({
			model: this._settings
			, el: '#dice'
		}), 'dice');

		this._views.add(new TurnView({
			model: this._settings
			, el: '#turn'
		}), 'turn');

		this._views.add(new BoardView({
			collection: this._places
			, el: '#board'
			, rows: this._settings.get('rows')
			, cols: this._settings.get('cols')
		}), 'board');

		this._views.add(new ControlsView({
			collection: this._controls
			, el: '#controls'
		}), 'controls');

		this._views.add(new NotificationView({
			el: '#notification'
		}), 'notification');

		this._views.add(new UserView({
			el: '#user'
		}), 'user');

		this._views.add(new WindowView(), 'window');

		return this;
	};

	UI.updateRendering = function () {
		if (!this._settings.get('noui')) {
			try {
				this._views.findByCustom('board').updateData({
					rows: this._settings.get('rows')
					, cols: this._settings.get('cols')
				});
			}
			catch (e) {}
		}

		return this;
	};

	UI.resetRendering = function () {
		if (!this._settings.get('noui')) {
			try {
				// reset views
				this._views.findByCustom('board').reset();
				this._views.findByCustom('notification').reset();

				// hide others
				this._views.findByCustom('controls').hide();
			}
			catch (e) {}
		}

		return this;
	};

	return UI;
});
