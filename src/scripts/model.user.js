define([
	'underscore'
	, 'backbone'
	, 'tools'
], function (_, Backbone, Tools) {
	'use strict';

	var User = Backbone.Model.extend({
		defaults: {
			turn: -1
			, languages: []
			, dict: {}
		}
	});

	return User;
});
