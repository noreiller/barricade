define([
	'underscore'
	, 'backbone'
	, '../tools/tools'
], function (_, Backbone, Tools) {
	'use strict';

	var Model = Backbone.Model.extend({
		defaults: {
			name: 'player'
			, color: false
			, path: 'home'
			, piece: 'player'
			, value: -1
			, ai: false
			, language: 'en'
		}
	});

	return Model;
});
