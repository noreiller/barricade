(function (window) {

	define([
		'underscore'
		, 'backbone'
		, '../tools/tools'
		, '../game/game.events'
		, '../models/model.abstract'
	], function (_, Backbone, Tools, Events, AbstractModel) {
		'use strict';

		var Model = AbstractModel.extend({
			defaults: {
				col: -1
				, color: '#000000'//: false
				, name: 'place'
				, origin: {}
				, path: false
				, piece: false
				, row: -1
				, moveable: false
				, selected: false
				, value: 1
				, pieceId: -1
				, ai: false
			}

			, initialize: function () {
				_.bindAll(this
					, 'mutatesTo'
					, 'pieceMoved'
					, 'reset'
					, 'isAI'
					, 'isPath'
					, 'isHome'
					, 'isBarricade'
					, 'isGoal'
					, 'hasPiece'
					, 'hasPlayer'
					, 'hasBarricade'
				);

				this.set('origin', _.omit(this.toJSON(), 'origin'));

				if (this.get('piece')) {
					this.set('pieceId', this.cid);
				}

				return this;
			}

			, mutatesTo: function (attributes) {
				var self = this;

				attributes.selected = this.defaults.selected;
				attributes.moveable = this.defaults.moveable;

				if (attributes.piece) {
					this.trigger('mutates', attributes);
					// window.setTimeout(function () {
					// 	self.trigger('mutates', attributes);
					// }, 0);
				}

				// this.set(_.omit(attributes, 'row', 'col', 'path', 'origin'));
				window.setTimeout(function () {
					self.set(_.omit(attributes, 'row', 'col', 'path', 'origin'));
				}, 0);

				return this;
			}

			, pieceMoved: function () {
				var attributes = this.get('origin');

				attributes.piece = this.defaults.piece;
				attributes.pieceId = this.defaults.pieceId;

				if (this.isBarricade()) {
					// It becomes a path
					// @todo find a better way to set value = 1
					attributes.value = this.defaults.value;
				}

				this.mutatesTo(attributes);

				return this;
			}

			, deepSet: function (attributes) {
				var origins = this.get('origin');

				_.each(_.pick(attributes, 'name', 'color', 'language'), function (item, ind) {
					origins[ind] = attributes[ind];
				});

				this.set('origin', origins);

				return this;
			}

			, reset: function () {
				this.mutatesTo(this.get('origin'));

				return this;
			}

			, isAI: function () {
				return !!this.get('ai');
			}

			/**
			 * All places are a Path
			 * @return {Boolean}
			 */
			, isPath: function () {
				return !!this.get('path');
			}

			, isHome: function () {
				return this.get('path') === 'home';
			}

			, isBarricade: function () {
				return this.get('path') === 'barricade';
			}

			, isGoal: function () {
				return this.get('path') === 'goal';
			}

			/**
			 * All pieces are a Piece
			 * @return {Boolean} [description]
			 */
			, hasPiece: function () {
				return !!this.get('piece');
			}

			, hasPlayer: function () {
				return this.get('piece') === 'player';
			}

			, hasBarricade: function () {
				return this.get('piece') === 'barricade';
			}
		});

		return Model;
	});

})(window);
