define([
	'underscore'
	, 'backbone'
	, 'tools'
], function (_, Backbone, Tools) {
	'use strict';

	/**
	 * @see model.player
	 */
	var User = Backbone.Model.extend({
		defaults: {
			languages: []
			, dict: {}
			, zoom: 1
		}
	});

	return User;
});
