define([
	'underscore'
	, 'backbone'
	, 'tools'
], function (_, Backbone, Tools) {
	'use strict';

	var Model = Backbone.Model.extend({
		defaults: {
			name: 'player'
			, color: false
			, background: false
			, path: false
			, piece: 'player'
			, value: -1
			, ai: false
			, language: 'en'
		}

		, validate: function (attributes) {
			if (attributes.color !== attributes.background) {
				this.set({
					color: attributes.color || attributes.background
					, background: attributes.color || attributes.background
				});
			}
		}
	});

	return Model;
});
