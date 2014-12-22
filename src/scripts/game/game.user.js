define([
	'underscore'
	, 'backbone'
	, '../tools/tools'
	, '../models/model.user'
], function (_, Backbone, Tools, UserModel) {
	'use strict';

	var User = {};

	User.initialize = function () {
		this.storage = new UserModel();
	};

	return User;
});
