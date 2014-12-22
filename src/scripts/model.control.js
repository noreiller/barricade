define([
	'underscore'
	, 'backbone'
	, 'tools'
	, 'model.abstract'
], function (_, Backbone, Tools, AbstractModel) {
	'use strict';

	var Model = AbstractModel.extend({
		defaults: {
			name: 'control'
			, label: 'control'
			, symbol: null
			, event: false
		}
	});

	return Model;
});
