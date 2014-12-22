define([
	'underscore'
	, 'backbone'
	, '../tools/tools'
	, '../game/game.events'
	, '../game/game.user'
	, '../models/model.abstract'
	, '../game/game.maps'
], function (_, Backbone, Tools, Events, User, AbstractModel, maps) {
	'use strict';

	var Model = AbstractModel.extend({
		defaults: {
			playersIndexes: []
			, turn: -1
			, places: {}
			, map: [[]]
			, mapName: false
			, rows: 0
			, cols: 0
			, dice: -1
			, diceMin: 1
			, diceMax: 6
			, pathCost: 1
			, barricadeCost: 2
			, homeCost: 5
			, playerCost: 10
			, goalCost: 15
			, paused: true
			, createdAt: false
			, noui: false
			, noanimation: false
		}

		, initialize: function () {
			this.set('createdAt', (new Date()).toJSON());

			return this;
		}

		, validate: function (attributes) {
			if (!attributes.mapName) {
				return false;
			}
			else {
				this.validateMap(attributes);
			}

			if (attributes.dice !== - 1) {
				this.validateDice(attributes);
			}
		}

		, validateMap: function (attributes) {
			if (attributes.mapName !== this.get('mapName')) {
				var playersIndexes = [];

				// Create a temporary storage for places
				var places = [];

				attributes.map = _.clone(maps[attributes.mapName].map);
				attributes.places = _.clone(maps[attributes.mapName].places);

				_.each(attributes.map, function (value1, key1) {
					_.each(value1, function (value2, key2) {
						// Update the place attributes
						attributes.places[value2] = this.processPlace(_.extend({
							path: 'home'
							, piece: 'player'
							, ai: true
							, value: value2
						}, attributes.places[value2]));

						// If it's a path
						if (attributes.places[value2] && attributes.places[value2].path) {
							// Stores the place to be added later
							places.push(_.extend({}, attributes.places[value2], {
								value: value2
								, row: key1
								, col: key2
							}));
						}

						// If tile number does not exist in the list, or if it's a player
						if (playersIndexes.indexOf(value2) === -1 && (!attributes.places[value2] || (
							attributes.places[value2] && attributes.places[value2].piece === 'player'
						))) {
							// Register the tile
							playersIndexes.push(value2);
						}
					}, this);
				}, this);

				// Random a player place for the current user
				var currentPlayerIndex = _.sample(playersIndexes);
				attributes.places[currentPlayerIndex].ai = false;

				// If user has already been defined
				if (User.storage.get('name')) {
					// Send back the name to the proposals
					Tools.lorem.names.push(attributes.places[currentPlayerIndex].name);

					// Send back the color to the proposals
					Tools.lorem.colors.push(attributes.places[currentPlayerIndex].color);

					// Update attributes of the player
					attributes.places[currentPlayerIndex].name = User.storage.get('name');
					attributes.places[currentPlayerIndex].color = User.storage.get('color');
					attributes.places[currentPlayerIndex].language = User.storage.get('language');

					// Update attributes of the places
					_.each(_.filter(places, function (item) {
						return item.value === currentPlayerIndex;
					}), function (item) {
						item.name = User.storage.get('name');
						item.color = User.storage.get('color');
						item.language = User.storage.get('language');
					});
				}

				// Update model
				this.set({
					mapName: attributes.mapName
					, playersIndexes: playersIndexes
					, places: attributes.places
					, rows: attributes.map.length
					, cols: attributes.map[0].length
				});

				// Register places
				_.each(places, function (place) {
					Events.trigger('game:place', place);
				}, this);

				// Register players
				_.each(playersIndexes, function (playerIndex) {
					Events.trigger('game:player', attributes.places[playerIndex]);
				}, this);

				// Register the attribution of the current player turn
				Events.trigger('game:player:current', currentPlayerIndex);

				// Notify settings changes
				Events.trigger('game:settings');
			}
		}

		, validateDice: function (attributes) {
			if (attributes.dice === this.get('dice')) {
				this.trigger('change:dice');
			}
		}

		, processPlace: function (attributes) {
			// Get a random name
			if (!attributes.name) {
				attributes.name = _.sample(Tools.lorem.names);

				Tools.lorem.names = _.filter(Tools.lorem.names, function (value) {
					return value !== attributes.name;
				});
			}

			// When no color at all is provided
			if (!attributes.color) {
				// Create one from the samples
				var hue = _.sample(Tools.lorem.colors);
				var color = Tools.color.random({
					hue: hue
				});

				attributes.color = color;

				Tools.lorem.colors = _.filter(Tools.lorem.colors, function (value) {
					return value !== hue;
				});
			}

			return attributes;
		}

		, nextTurn: function () {
			if (this.get('playersIndexes').length) {
				// get the index of the current turn
				var ind = this.get('turn');

				var playersIndexes = this.get('playersIndexes');

				// game just started so random
				if (ind < 0) {
					ind = _.sample(playersIndexes);
				}
				// next turn
				else if (1 + ind <= playersIndexes[playersIndexes.length - 1]) {
					ind++;
				}
				// reset turn
				else {
					ind = playersIndexes[0];
				}

				this.set('turn', ind);
			}

			return this;
		}

		/**
		 * Update the dice value with a random number between the min and max
		 * entries
		 * @return {object} this
		 */
		, rollDice: function () {
			this.set({
				'dice': Tools.random.bounds(this.get('diceMin'), this.get('diceMax'))
			}, {
				validate: true
			});

			return this;
		}

		, getWalkableTiles: function () {
			var tiles = [];

			_.each(this.get('places'), function (item, ind) {
				if (item.path) {
					tiles.push(Number(ind));
				}
			}, this);

			return tiles;
		}
	});

	return Model;
});
