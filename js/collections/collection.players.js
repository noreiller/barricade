define([
	'underscore'
	, 'backbone'
	, '../tools/tools'
	, '../models/model.player'
], function (_, Backbone, Tools, PlayerModel) {
	'use strict';

	var Collection = Backbone.Collection.extend({
		model: PlayerModel

		, getPlayer: function (ind) {
			if (!ind) {
				return;
			}

			return this.findWhere({
				value: ind
			});
		}
	});

	return Collection;
});
