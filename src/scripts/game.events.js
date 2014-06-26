define([
	'underscore'
	, 'backbone'
	, 'tools'
], function (_, Backbone, Tools) {
	'use strict';

	/**
	 * Create a new event dispatcher
	 * @see http://backbonejs.org/#Events-catalog
	 *
	 * @event game:ai:play                 Requests AI to play
	 * @event game:ai:validate:block       Requests a validation of a block move
	 * @event game:ai:validate:defensive   Requests a validation of a defensive move
	 * @event game:ai:validate:offensive   Requests a validation of an offensive move
	 * @event game:check                   Requests a check of the status of the game
	 * @event game:move:find               Requests to find a move
	 * @event game:move:validate           Requests to validate a move
	 * @event game:next                    Requests a turn change
	 * @event game:pass                    Requests the player to pass its turn
	 * @event game:pause                   Requests to set the game in pause
	 * @event game:reset                   Requests a reset of the game
	 * @event game:resume                  Requests to resume the game
	 * @event game:settings:open           Requests the settings panel opening
	 * @event game:settings:close          Requests the settings panel closing
	 * @event game:user:close              Requests the user panel closing
	 * @event game:user:open               Requests the user panel opening
	 * @event game:user:language           Requests an update of the language of the user
	 * @event game:user:update             Requests an update of the settings of the user
	 *
	 * @event game:dice                    The dice has been rolled
	 * @event game:move:forbidden          The requested move is forbidden
	 * @event game:move:save               The requested move is being saved
	 * @event game:move:success            The requested move is autorized
	 * @event game:move:rendenred          The requested move has been rendered on the board
	 * @event game:notify                  Global notification
	 * @event game:place                   A new place of the board has been defined
	 * @event game:played                  A player has played
	 * @event game:player                  A new player has been defined
	 * @event game:player:current          The current player has its turn defined
	 * @event game:selection               A player has selected a piece of the board
	 * @event game:selection:forbidden     The requested selection is forbidden
	 * @event game:selection:success       The requested selection is autorized
	 * @event game:user                    The settings of the user have changed
	 * @event game:settings                The settings of the game have changed
	 * @event game:turn                    The game turn has changed
	 * @event game:won                     The game has been won by a player
	 */
	var Events = _.clone(Backbone.Events);

	return Events;
});
