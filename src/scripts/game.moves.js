(function (window, document) {
	define([
		'underscore'
		, 'backbone'
		, 'easystar'
		, 'tools'
		, 'game.events'
	], function (_, Backbone, EasyStar, Tools, Events) {
		'use strict';

		var Moves = {};

		Moves.placeSelected = function (row, col) {
			// If the game is not in pause mode
			if (!this._settings.get('paused')) {
				var player = this._players.getPlayer(this._settings.get('turn'));

				if (player.get('ai')) {
					return this;
				}

				var from = this._places.findWhere({
					selected: true
				});

				var to = this._places.findWhere({
					row: row
					, col: col
				});

				// There is no selected piece and the selection is moveable
				if (!from && to.get('moveable')) {
					// Select it
					to.set('selected', true);
				}
				// There is a selected piece and it's a barricade
				else if (from && from.hasBarricade()) {
					// If the destination does not contain piece, is not a home nor the goal
					if (!to.hasPiece() && !to.isHome() && !to.isGoal()) {
						// Move it
						Events.trigger('game:move:save', from, to);
					}
				}
				// There is a selected piece and the destination is moveable or not a home
				else if (from && (to.get('moveable') || !to.isHome())) {
					// The selected piece and the destination are from the same famiy
					if (from.get('value') === to.get('value') && to.get('moveable')) {
						// Toggle their selectability
						to.set('selected', true);
						from.set('selected', false);
					}
					// Otherwise
					else {
						// Validate the moves
						Events.trigger('game:move:find', from, to);
					}
				}
				else {
					Events.trigger('game:selection:forbidden');
				}
			}

			return this;
		};

		Moves.findPath = function (from, to, options) {
			if (!options) {
				options = {};
			}

			var fromAttributes = from.toJSON();
			var easystar = new EasyStar.js();

			easystar.setGrid(this._places.getGrid());
			easystar.setAcceptableTiles(this._settings.getWalkableTiles());

			// Optional tile costs
			// @todo getCostMap
			if (options.costs) {
				_.each(options.costs, function (cost, tile) {
					easystar.setTileCost(tile, cost);
				});
			}

			// Optional avoiding tiles
			if (options.avoid) {
				_.each(options.avoid, function (tile) {
					easystar.avoidAdditionalPoint(tile.x, tile.y);
				});
			}

			// Search for all homes
			var homes = this._places.where({
				path: 'home'
			});

			// If the from place is the piece's home
			if (_.filter(homes, function (item) {
				return (item.get('col') === from.get('col') && item.get('row') === from.get('row'));
			}).length) {
				// Filter the from homes
				var fromHomes = _.filter(homes, function (item) {
					return from.get('value') === item.get('value');
				}, this);

				// Move the from coordinates to the first in the list
				fromAttributes.col = fromHomes[0].get('col');
				fromAttributes.row = fromHomes[0].get('row');
			}

			// For each home places
			_.each(homes, function (item) {
				// If not the from place
				if (item.get('col') !== fromAttributes.col && item.get('row') !== fromAttributes.row) {
					// Avoid it
					easystar.avoidAdditionalPoint(item.get('col'), item.get('row'));
				}
			});

			easystar.findPath(
				fromAttributes.col
				, fromAttributes.row
				, to.get('col')
				, to.get('row')
				, function (path) {
					window.setTimeout(function () {
						Events.trigger(
							options.callbackEventName || 'game:move:validate'
							, from
							, to
							, path || []
							, options
						);
					}, 0);
				}
			);

			easystar.calculate();

			return this;
		};

		Moves.validateMove = function (from, to, moves) {
			// A move is valid by default
			var validation = true;

			// We remove the first move since it's the start and it should not be counted
			moves.splice(0, 1);

			// Check the moves
			_.every(moves, function (move, ind) {
				// Check if the move is duplicated
				if (Tools.indexesOfObject(moves, move).length > 1) {
					validation = false;
				}
				// Check if the move is not the last and contain a piece
				else if (moves.length - 1 !== ind && !this._places.findWhere({
					row: move.y
					, col: move.x
					, piece: false
				})) {
					validation = false;
				}

				return !validation;
			}, this);

			if (validation && moves.length === this._settings.get('dice')) {
				Events.trigger('game:move:save', from, to);
			}
			else {
				Events.trigger('game:move:forbidden');
			}

			return this;
		};

		Moves.saveMove = function (from, to) {
			try {
				Events.trigger('game:move:success');

				if (!from.get('selected')) {
					from.set({
						selected: true
					});
				}

				// Save places attributes to an object to allow them to be modified
				var fromAttributes = from.toJSON();
				var toAttributes = to.toJSON();

				// Create an array to register the moving pieces
				var moves = [];

				// We renders each move
				if (!this._settings.get('noui')) {
					// So we listen to the event
					this.listenTo(Events, 'game:move:rendered', function (pieceId) {
						moves.splice(moves.indexOf(pieceId), 1);

						if (!moves.length) {
							this.stopListening(Events, 'game:move:rendered');
							Events.trigger('game:played');
						}
					}, this);
				}

				// Get player
				var player = this._players.getPlayer(this._settings.get('turn'));

				// And more than a path, another player
				if (to.hasPlayer() && from.get('value') !== to.get('value')) {
					// Find the first free home place from the player
					var futurePlayerHome = this._places.findWhere({
						value: toAttributes.value
						, path: 'home'
						, piece: false
					});

					// Register the moving pieces
					moves.push(toAttributes.pieceId, fromAttributes.pieceId);

					// Origin is moved
					from.pieceMoved();

					// Player goes back home
					futurePlayerHome.mutatesTo(toAttributes);

					// Destination becomes moving piece
					to.mutatesTo(fromAttributes);

					// Notify information
					Events.trigger('game:notify', 'game_player_captured_player', player.toJSON());
				}
				// And more than a path, a barricade
				else if (to.hasBarricade()) {
					// Find the first free home place from the player
					var futureBarricadeHome = this._places.findWhere({
						value: fromAttributes.value
						, path: 'home'
						, piece: false
					});

					// Updates the barricade value
					toAttributes.value = fromAttributes.value;

					// Register the moving pieces
					moves.push(toAttributes.pieceId, fromAttributes.pieceId);

					// From piece is at home and has not yet moved
					if (!futureBarricadeHome) {
						// Invert the places
						to.mutatesTo(fromAttributes);
						from.mutatesTo(toAttributes);

						// Select the barricade right now
						from.set({
							selected: true
							, moveable: true
						});
					}
					// Otherwise
					else {
						// Origin is moved
						from.pieceMoved();

						// Destination becomes moving piece
						to.mutatesTo(fromAttributes);

						// Barricade goes to player's home
						futureBarricadeHome.mutatesTo(toAttributes);

						// Select the barricade right now
						futureBarricadeHome.set({
							selected: true
							, moveable: true
						});
					}

					// Notify information
					Events.trigger('game:notify', 'game_player_captured_barricade', player.toJSON());
				}
				// Just a simple path
				else if (to.isPath()) {
					// If the piece to move is a barricade
					if (from.hasBarricade()) {
						// Forget about the previous barricade value
						fromAttributes.value = toAttributes.value;
					}

					// Register the moving piece
					moves.push(fromAttributes.pieceId);

					// Selection is moved
					from.pieceMoved();

					// Item becomes selection
					to.mutatesTo(fromAttributes);


					// Notify information
					Events.trigger('game:notify', 'game_player_moved', player.toJSON());
				}
				else {
					window.console.log('Should never occurs... :)');
				}

				// No rendering, trigger the event right now
				if (this._settings.get('noui')) {
					Events.trigger('game:played');
				}
			}
			catch (e) {
				Events.trigger('game:error', e);
			}

			return this;
		};

		Moves.getOpponentsHomeDoors = function () {
			var list = [];

			var grid = this._places.getGrid();

			var opponentHomes = _.groupBy(_.filter(this._places.where({
				path: 'home'
			}), function (item) {
				return item.get('value') !== this._settings.get('turn');
			}, this), function (item) {
				return item.get('value');
			}, this);

			var opponentFirstHomes = _.every(opponentHomes, function (item) {
				return item[0];
			}, this);

			_.each(opponentFirstHomes, function (item) {
				var itemAttributes = item.toJSON();

				var checkList = [
					{ col: itemAttributes.col - 1 , row: itemAttributes.row - 1 }
					, { col: itemAttributes.col - 1 , row: itemAttributes.row }
					, { col: itemAttributes.col - 1 , row: itemAttributes.row + 1 }
					, { col: itemAttributes.col , row: itemAttributes.row - 1 }
					, { col: itemAttributes.col , row: itemAttributes.row + 1 }
					, { col: itemAttributes.col + 1 , row: itemAttributes.row + 1 }
					, { col: itemAttributes.col + 1 , row: itemAttributes.row }
					, { col: itemAttributes.col + 1 , row: itemAttributes.row - 1 }
				];

				var found;
				_.each(checkList, function (check) {
					found = this._places.findWhere(_.extend(check, {
						path: 'path'
					}));
				}, this);

				if (found) {
					list.push(found);
				}

			}, this);

			return list;
		};

		return Moves;
	});

})(window, document);
