(function (window, document) {
	define([
		'underscore'
		, 'backbone'
		, 'easystar'
		, 'tools'
		, 'game.events'
	], function (_, Backbone, EasyStar, Tools, Events) {
		'use strict';

		var AI = {};

		AI.playAI = function () {
			// Is there a captured barricade ?
			var captured = this._places.findWhere({
				path: 'home'
				, piece: 'barricade'
				, value: this._settings.get('turn')
			});

			// Get every players of its family which is not at home
			var players = _.filter(this._places.where({
				value: this._settings.get('turn')
				, piece: 'player'
			}), function (item) {
				return item.get('path') !== 'home';
			}, this);

			// But we include only one from home
			var playerAtHome = this._places.findWhere({
				value: this._settings.get('turn')
				, path: 'home'
				, piece: 'player'
			});

			if (playerAtHome) {
				players.push(playerAtHome);
			}

			// Get every opponents which is not at home
			var opponents = _.filter(this._places.where({
				piece: 'player'
			}), function (item) {
				return (
					item.get('value') !== this._settings.get('turn')
					&& item.get('path') !== 'home'
				);
			}, this);

			// Get every barricades
			var barricades = this._places.where({
				piece: 'barricade'
			});

			// Search for the goal
			var goal = this._places.findWhere({
				path: 'goal'
			});

			// Take a snapshot of the current grid
			var grid = this._places.getGrid();

			// Store some temporary AI variables
			this._ai = {
				count: 0
				, validatedPaths: []
			};

			// If there is no captured barricade
			if (!captured) {
				// We will search every pathes:
				// from every player to goal
				this._ai.count += players.length;
				// from every player to each opponent
				if (opponents.length) {
					this._ai.count += players.length * opponents.length;
				}
				// and from every player to each barricade
				if (barricades.length) {
					this._ai.count += players.length * barricades.length;
				}

				// For each player
				_.each(players, function (player) {
					// Find the path to the goal with some costs
					var costs = {};

					// Find the path to the goal avoiding own family but self
					var avoid = _.map(_.filter(players, function (item) {
						return (item.get('col') !== player.get('col') && item.get('row') !== player.get('row'));
					}), function (item) {
						return {
							x: item.get('col')
							, y: item.get('row')
						};
					});

					if (barricades.length) {
						costs[barricades[0].get('value')] = this._settings.get('barricadeCost');
					}

					_.each(this.getOpponentsHomeDoors(), function (item) {
						costs[item.get('value')] = this._settings.get('homeCost');
					}, this);

					if (opponents.length) {
						costs[opponents[0].get('value')] = this._settings.get('playerCost');
					}

					Events.trigger('game:move:find', player, goal, {
						ai: true
						, costs: costs
						, avoid: avoid
						, callbackEventName: 'game:ai:validate:offensive'
					});

					// Find the path to each opponent
					_.each(opponents, function (opponent) {
						Events.trigger('game:move:find', player, opponent, {
							ai: true
							, callbackEventName: 'game:ai:validate:offensive'
						});
					}, this);

					// Find the path to each barricade
					_.each(barricades, function (barricade) {
						Events.trigger('game:move:find', player, barricade, {
							ai: true
							, callbackEventName: 'game:ai:validate:offensive'
						});
					}, this);
				}, this);
			}
			// Or if there is a captured barricade and opponents
			else if (captured && opponents.length) {
				// We will search every player to opponent paths
				// from every opponent to goal
				this._ai.count += opponents.length;
				if (opponents.length) {
					this._ai.count += opponents.length * players.length;
				}

				// For each opponent
				_.each(opponents, function (opponent) {
					// Find the path to the goal
					Events.trigger('game:move:find', opponent, goal, {
						ai: true
						, callbackEventName: 'game:ai:validate:defensive'
					});

					// Find the path to each player
					_.each(players, function (player) {
						Events.trigger('game:move:find', player, opponent, {
							ai: true
							, callbackEventName: 'game:ai:validate:defensive'
						});
					}, this);
				}, this);
			}
			// Find a random location for the captured barricade
			else if (captured) {
				this.barricadeRandomAI(captured);
			}

			return this;
		};

		AI.barricadeRandomAI = function (barricade) {
			Events.trigger('game:move:save', barricade, _.sample(this._places.where({
				path: 'path'
				, piece: false
			})));
		};

		// @deprecated
		AI.barricadeOpponentAI = function (barricade) {
			// Get every opponents
			var opponents = _.filter(this._places.where({
				piece: 'player'
			}), function (item) {
				return (
					item.get('value') !== this._settings.get('turn')
				);
			}, this);

			// Search for the goal
			var goal = this._places.findWhere({
				path: 'goal'
			});

			// Block the first free move to the goal of the closest opponent to the goal
			Events.trigger('game:move:find', _.reduce(opponents, function (prev, current) {
				return current.get('row') < prev.get('row') ? current : prev;
			}), goal, {
				ai: true
				, callbackEventName: 'game:ai:validate:block'
				, barricade: {
					row: barricade.get('row')
					, col: barricade.get('col')
				}
				, maxLength: true
			});

			return this;
		};

		AI.validateOffensiveMoveAI = function (from, to, moves, options) {
			// Create an object with values to be processed to get the path score
			var scores = {
				aim: to.get('piece') || to.get('path')
				, aimLength: moves.length - 1
				, levels: to.get('row') - from.get('row')
				, method: 'free'
			};

			// We remove the first move since it's the start and it should not be counted
			moves.splice(0, 1);

			// If the moves length is at least the dice amount
			if (moves.length >= this._settings.get('dice')) {
				// Remove the moves after the dice amount
				moves.splice(this._settings.get('dice'));

				// Update the destination
				to = this._places.findWhere({
					row: moves[moves.length - 1].y
					, col: moves[moves.length - 1].x
				});

				// Verify each move
				_.each(moves, function (move, ind) {
					// If method is still 'free'
					if (scores.method === 'free') {
						// If not last move and it contains a piece
						if (ind !== moves.length - 1 && this._places.findWhere({
							row: move.y
							, col: move.x
						}).hasPiece()) {
							scores.method = false;
						}
						// Last move
						else if (ind === moves.length - 1) {
							// If same family
							if (to.hasPlayer() && from.get('value') === to.get('value')) {
								scores.method = false;
							}
							// Opponent
							else if (to.hasPlayer() && from.get('value') !== to.get('value')) {
								scores.method = 'player';
							}
							// Opponent
							else if (to.hasBarricade()) {
								scores.method = 'barricade';
							}
						}
					}
				}, this);
			}
			else {
				scores.method = false;
			}

			if (scores.method) {
				scores.pathLength = moves.length;

				this._ai.validatedPaths.push({
					moves: moves
					, score: this.getPathScore(scores)
					, from: from
					, to: to
				});
			}

			this._ai.count--;

			if (this._ai.count <= 0) {
				// There is no validated move
				if (!this._ai.validatedPaths.length) {
					// Player pass his turn
					Events.trigger('game:pass');
				}
				// There is only one validated move
				else if (this._ai.validatedPaths.length === 1) {
					// Trigger it
					Events.trigger('game:move:save', this._ai.validatedPaths[0].from, this._ai.validatedPaths[0].to);
				}
				// Otherwise there are many validated moves
				else {
					// Pick a random one
					var movesToTrigger = _.reduce(this._ai.validatedPaths, function (prev, current) {
						return current.score > prev.score ? current : prev;
					});

					// Trigger it
					Events.trigger('game:move:save' , movesToTrigger.from , movesToTrigger.to);
				}
			}

			return this;
		};

		AI.validateDefensiveMoveAI = function (from, to, moves, options) {
			if (!options) {
				options = {};
			}

			if (moves.length) {
				// Create an object with values to be processed to get the path score
				var scores = {
					aim: to.get('piece') || to.get('path')
					, aimLength: moves.length - 1
					, levels: to.get('row') - from.get('row')
					, method: 'free'
				};

				// We remove the first move since it's the start and it should not be counted
				moves.splice(0, 1);

				var emptyPlaceIndex = false;

				// If the moves can be made with the maximum amount of the dice or max length is autorized
				if (options.maxLength || moves.length <= this._settings.get('diceMax')) {
					// Verify each move
					_.each(moves, function (move, ind) {
						// If an empty place has not yet been found
						if (!emptyPlaceIndex) {
							var place = this._places.findWhere({
								row: move.y
								, col: move.x
							});

							// If there is no piece at this place or if it's not a home or the goal
							if (ind !== moves.length - 1 && !place.hasPiece() && !place.isGoal() && !place.isHome()) {
								emptyPlaceIndex = ind;
							}
						}
					}, this);
				}

				if (emptyPlaceIndex !== false) {
					moves.splice(emptyPlaceIndex + 1);
					scores.pathLength = moves.length;

					this._ai.validatedPaths.push({
						moves: moves
						, score: this.getPathScore(scores)
						, from: from
						, to: this._places.findWhere({
							row: moves[emptyPlaceIndex].y
							, col: moves[emptyPlaceIndex].x
						})
					});
				}
			}

			this._ai.count--;

			if (this._ai.count <= 0) {
				// Get the barricade
				var barricade = this._places.findWhere({
					path: 'home'
					, piece: 'barricade'
					, value: this._settings.get('turn')
				});

				// If no validated move
				if (!this._ai.validatedPaths.length) {
					// Random barricade
					this.barricadeRandomAI(barricade);
				}
				// There is only validated move
				else if (this._ai.validatedPaths.length === 1) {
					// Trigger it
					Events.trigger('game:move:save', barricade, this._ai.validatedPaths[0].to);
				}
				// Otherwise there are many validated moves
				else {
					// Pick a random one
					var movesToTrigger = _.reduce(this._ai.validatedPaths, function (prev, current) {
						return current.score > prev.score ? current : prev;
					});

					// Trigger it
					Events.trigger('game:move:save' , barricade, movesToTrigger.to);
				}
			}

			return this;
		};

		AI.validateBlockMoveAI = function (from, to, moves, options) {
			if (!moves.length) {
				this.barricadeRandomAI(this._places.findWhere({
					row: options.barricade.row
					, col: options.barricade.col
				}));
			}
			else {
				var validation = false;

				// Search for the goal
				var goal = this._places.findWhere({
					path: 'goal'
				});

				// We remove the first move since it's the start and it should not be counted
				moves.splice(0, 1);

				// Verify each move
				_.each(moves, function (move, ind) {
					// If validation has its original value
					if (!validation) {
						var place = this._places.findWhere({
							row: move.y
							, col: move.x
						});

						// If there is no piece at this place and if it's not a home nor the goal
						if (!place.hasPiece() && !place.isGoal() && !place.isHome()) {
							validation = ind;
						}
					}
				}, this);

				if (validation !== false) {
					Events.trigger('game:move:save', this._places.findWhere({
						row: options.barricade.row
						, col: options.barricade.col
					}), this._places.findWhere({
						row: moves[validation].y
						, col: moves[validation].x
					}));
				}
				else {
					this.barricadeOpponentAI(this._places.findWhere({
						row: options.barricade.row
						, col: options.barricade.col
					}));
				}
			}

			return this;
		};

		return AI;
	});

})(window, document);
