define([
	'underscore'
	, 'backbone'
	, '../tools/tools'
], function (_, Backbone, Tools) {
	'use strict';

	var Model = Backbone.Model.extend({
		reset: function (attributes) {
			this.set(_.extend(this.defaults, attributes));

			return this;
		}
	});

	return Model;
});
