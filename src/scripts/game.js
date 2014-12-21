(function (window, document) {
	define([
		'underscore'
		, 'backbone'
		, 'easystar'
		, 'tools'
		, 'game.moves'
		, 'game.ai'
		, 'game.ui'
		, 'game.events'
		, 'game.user'
		, 'game.i18n'
		, 'collection.board'
		, 'collection.players'
		, 'collection.controls'
		, 'collection.i18n'
		, 'model.settings'
	], function (_, Backbone, EasyStar, Tools, Moves, AI, UI, Events, User, I18N, BoardCollection, PlayersCollection, ControlsCollection, I18nCollection, SettingsModel) {
		'use strict';

		var App = _.extend(Backbone.Events, Moves, AI, UI);

		App.initialize = function (settings) {
			// User
			if (!User.storage) {
				User.initialize();
			}

			// Local collections
			this._players = new PlayersCollection();
			this._places = new BoardCollection();
			this._settings = new SettingsModel();
			this._controls = new ControlsCollection([{
				name: 'pause'
				, event: 'game:pause'
				, label: 'control_pause_game'
			}, {
				name: 'resume'
				, event: 'game:resume'
				, label: 'control_resume_game'
			}, {
				name: 'pass'
				, event: 'game:pass'
				, label: 'control_pass_turn'
			}]);
			this._i18n = new I18nCollection(I18N);

			// Stores user default settings
			User.storage.set({
				dict: this._i18n.getDetectedLanguage().toJSON()
				, languages: this._i18n.getAvailableLanguages()
				, language: this._i18n.detectLanguage()
			});

			// Listen to game events
			this.listen();

			// Create default settings
			if (!settings) {
				settings = {};
			}

			// Unless there is a no-UI setting
			if (!settings.noui) {
				// Render the game
				this.render();
			}

			// Proceed to settings validation
			this._settings.set(settings, { validate: true });

			// Start the game
			this.startGame();

			return this;
		};

		App.listen = function () {
			this.listenTo(this._settings, 'change:dice', this.diceRolled, this);
			this.listenTo(this._settings, 'change:mapName', this.updateRendering, this);
			this.listenTo(this._settings, 'change:turn', this.checkPlayer, this);
			this.listenTo(this._settings, 'change:turn', this.turnChanged, this);

			this.listenTo(Events, 'game:ai:play', this.playAI, this);
			this.listenTo(Events, 'game:ai:validate:block', this.validateBlockMoveAI, this);
			this.listenTo(Events, 'game:ai:validate:defensive', this.validateDefensiveMoveAI, this);
			this.listenTo(Events, 'game:ai:validate:offensive', this.validateOffensiveMoveAI, this);
			this.listenTo(Events, 'game:check', this.checkPlayer, this);
			this.listenTo(Events, 'game:move:find', this.findPath, this);
			this.listenTo(Events, 'game:move:save', this.saveMove, this);
			this.listenTo(Events, 'game:move:validate', this.validateMove, this);
			this.listenTo(Events, 'game:next', this.nextPlayer, this);
			this.listenTo(Events, 'game:pass', this.passPlayer, this);
			this.listenTo(Events, 'game:pause', this.pauseGame, this);
			this.listenTo(Events, 'game:place', this.addPlace, this);
			this.listenTo(Events, 'game:played', this.nextPlayer, this);
			this.listenTo(Events, 'game:player', this.addPlayer, this);
			this.listenTo(Events, 'game:player:current', this.setPlayer, this);
			this.listenTo(Events, 'game:reset', this.resetGame, this);
			this.listenTo(Events, 'game:resume', this.resumeGame, this);
			this.listenTo(Events, 'game:selection', this.placeSelected, this);
			this.listenTo(Events, 'game:settings', this.startGame, this);
			this.listenTo(Events, 'game:settings:update', this.updateSettings, this);
			this.listenTo(Events, 'game:user:language', this.updateUserLanguage, this);
			this.listenTo(Events, 'game:user:update', this.updateUser, this);
			this.listenTo(Events, 'game:won', this.stopGame, this);

			return this;
		};

		App.startGame = function () {
			if (this._settings.get('mapName')) {
				// Hide the settings panel
				Events.trigger('game:panel:close');

				// Un-pause the game
				Events.trigger('game:resume');

				// Call for the next player turn
				Events.trigger('game:next');
			}
			else {
				// Show the settings panel
				Events.trigger('game:panel:settings');
			}

			return this;
		};

		App.stopGame = function () {
			// Pause the game
			Events.trigger('game:pause');

			// Get player
			var player = this._players.getPlayer(this._settings.get('turn'));

			if (player) {
				// Notify information
				Events.trigger('game:notify', 'game_player_wins', player.toJSON());

				window.alert(player.get('name') + ' won the game !');
			}

			this.resetGame();

			return this;
		};

		App.resetGame = function () {
			// Reset the UI
			this.resetRendering();

			// Reset the settings
			this._settings.reset();

			// Reset the players
			this._players.reset();

			// Show the settings panel
			Events.trigger('game:panel:settings');

			return this;
		};

		App.resumeGame = function () {
			if (this._settings.get('paused')) {
				// Set the game on
				this._settings.set('paused', false);

				// Get player
				var player = this._players.getPlayer(this._settings.get('turn'));

				if (player) {
					// Notify information
					Events.trigger('game:notify', 'game_player_resumed', player.toJSON());
				}

				// Trigger a player check
				Events.trigger('game:check');
			}

			return this;
		};

		App.pauseGame = function () {
			if (!this._settings.get('paused')) {
				// Set the game on
				this._settings.set('paused', true);

				// Get player
				var player = this._players.getPlayer(this._settings.get('turn'));

				if (player) {
					// Notify information
					Events.trigger('game:notify', 'game_player_paused', player.toJSON());
				}
			}

			return this;
		};

		App.setPlayer = function (turn) {
			var player = this._players.getPlayer(turn);

			if (player) {
				// Dump player informations to the user
				User.storage.set(_.extend(player.toJSON(), {
					turn: turn
				}));

				// Notify changes
				Events.trigger('game:user', User.storage.toJSON());
			}

			return this;
		};

		App.updateSettings = function (attributes) {
			this._settings.set(attributes, {
				validate: true
			});

			return this;
		};

		App.updateUserLanguage = function (language) {
			// Save the dictionary
			User.storage.set({
				dict: this._i18n.getLanguage(language).toJSON()
				, language: language
			});

			// Notify it
			Events.trigger('game:language');
		};

		App.updateUser = function (attributes) {
			var player = this._players.getPlayer(User.storage.get('turn'));

			if (player) {
				// If language has changed
				if (attributes.language && player.get('language') !== attributes.language) {
					this.updateUserLanguage(attributes.language);
				}

				// Update player
				player.set(attributes, {
					validate: true
				});

				// Update pieces and homes
				var places = this._places.where({
					value: player.get('value')
				});

				_.invoke(places, 'set', _.omit(player.toJSON(), 'piece'));
				_.invoke(places, 'deepSet', attributes);

				// Update player informations to the user
				User.storage.set(player.toJSON());

				// Notify changes
				Events.trigger('game:user', User.storage.toJSON());
			}

			return this;
		};

		App.addPlayer = function (player) {
			if (!player.language) {
				player.language = User.storage.get('language');
			}

			var addedPlayer = this._players.add(player);

			// Notify information
			Events.trigger('game:notify', 'game_player_joins', addedPlayer.toJSON());

			return this;
		};

		App.addPlace = function (place) {
			this._places.add(place);

			return this;
		};

		App.diceRolled = function () {
			// Get player
			var player = this._players.getPlayer(this._settings.get('turn'));

			if (player) {
				// Notify information
				Events.trigger('game:notify', 'game_dice', player.toJSON(), this._settings.get('dice'));
			}

			return this;
		};

		App.turnChanged = function () {
			// Get player
			var player = this._players.getPlayer(this._settings.get('turn'));

			if (player) {
				// Notify information
				Events.trigger('game:notify', 'game_player_turn', player.toJSON());
				Events.trigger('game:turn', player.toJSON());
			}

			return this;
		};

		App.checkPlayer = function () {
			// Update moveablity of the pieces
			_.each(this._places.models, function (item) {
				if (this._settings.get('turn') === item.get('value') && item.hasPiece()) {
					item.set({
						moveable: item.hasPlayer() // true
						, selected: item.hasBarricade() // false
					});
				}
				else if (item.get('moveable') || item.get('selected')) {
					item.set({
						moveable: false
						, selected: false
					});
				}
			}, this);

			// If the game is not in pause mode
			if (!this._settings.get('paused')) {
				// Get player
				var player = this._players.getPlayer(this._settings.get('turn'));

				// Force an update of the UI
				this.updateRendering();

				// If player is AI
				if (player && player.get('ai')) {
					// Tell him to play
					window.setTimeout(function () {
						Events.trigger('game:ai:play');
					}, 0);
				}
			}

			return this;
		};

		App.passPlayer = function () {
			// Get player
			var player = this._players.getPlayer(this._settings.get('turn'));

			if (player) {
				// Notify information
				Events.trigger('game:notify', 'game_player_passes', player.toJSON());
			}

			// Call for the next player turn
			Events.trigger('game:next');

			return this;
		};

		App.nextPlayer = function () {
			// If there is a player on the goal
			if (this._places.findWhere({
				path: 'goal'
				, piece: 'player'
			})) {
				// Game is finished
				Events.trigger('game:won');
			}
			// If there is no captured barricade
			else if (!this._places.findWhere({
				path: 'home'
				, piece: 'barricade'
			})) {
				// Next player turn
				this._settings.nextTurn();

				// Roll the dice
				this._settings.rollDice();
			}
			// Otherwise
			else {
				Events.trigger('game:check');
			}

			return this;
		};

		/**
		 * Calculate the score of a path according to:
		 * - aim [goal, barricade, path, player]
		 * - aimLength [0:100*]
		 * - pathLength [1:6]
		 * - levels [-20*:0 , 0:20*]
		 * - method [free, barricade, player]
		 * @param  {object} options The options of the score
		 * @return {number}         The final score
		 */
		App.getPathScore = function (options) {
			var score = 0;

			// Add the cost to the aim
			score += this._settings.get(options.aim + 'Cost');

			// Add the levels
			score -= options.levels;

			// Add a ratio to goal cost about reachable
			if (options.aim === 'goal') {
				score += options.pathLength * this._settings.get('goalCost') / options.aimLength;
			}

			// Check aim and method equalty
			if (options.method === options.aim === 'barricade') {
				score += this._settings.get('barricadeCost');
			}
			else if (options.method === options.aim === 'player') {
				score += this._settings.get('playerCost');
			}
			else if (options.method === 'free') {
				score += this._settings.get('pathCost') * options.pathLength;
			}
			else {
				score += this._settings.get('pathCost');
			}

			return score;
		};

		return App;
	});

})(window, document);
