define([
	'underscore'
	, 'backbone'
	, 'localforage'
	, '../tools/tools'
	, '../models/model.user'
	, '../game/game.events'
], function (_, Backbone, localforage, Tools, UserModel, Events) {
	// 'use strict';

	var User = {};

	User.initialize = function (attributes, eventName) {
		var self = this;

		if (!attributes) {
			attributes = {};
		}

		localforage.getItem('user', function (err, value) {
			if (!err) {
				attributes = _.extend(attributes, value);
			}

			self.storage = new UserModel(attributes);

			Events.trigger(eventName);
		});
	};

	User.save = function () {
		localforage.setItem('user', _.omit(this.storage.toJSON(), 'value', 'turn'));
	};

	return User;
});
