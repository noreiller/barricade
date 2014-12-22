define([
	'underscore'
	, 'backbone'
	, '../tools/tools'
	, '../models/model.place'
], function (_, Backbone, Tools, PlaceModel) {
	'use strict';

	var Collection = Backbone.Collection.extend({
		model: PlaceModel

		, getRowCount: function () {
			return this.length ? _.reduce(this.models, function (prev, current) {
				return current.get('row') > prev.get('row') ? current : prev;
			}).get('row') : 0;
		}

		, getColCount: function () {
			return this.length ? _.reduce(this.models, function (prev, current) {
				return current.get('col') > prev.get('col') ? current : prev;
			}).get('col') : 0;
		}

		, getGrid: function () {
			var grid = [];

			if (this.length) {
				var rows = this.getRowCount();
				var cols = this.getColCount();

				for (var row = 0; row <= rows; row++) {
					grid.push([]);

					for (var col = 0; col <= cols; col++) {
						grid[row][col] = 0;
					}
				}

				_.each(this.models, function (item, i) {
					grid[item.get('row')][item.get('col')] = item.get('value');
				}, this);
			}

			return grid;
		}
	});

	return Collection;
});
