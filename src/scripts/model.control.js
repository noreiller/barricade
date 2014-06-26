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
			, event: false
		}
	});

	return Model;
});
