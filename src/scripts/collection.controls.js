define([
	'underscore'
	, 'backbone'
	, 'tools'
	, 'model.control'
], function (_, Backbone, Tools, ControlModel) {
	'use strict';

	var Collection = Backbone.Collection.extend({
		model: ControlModel
	});

	return Collection;
});
