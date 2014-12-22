define([
	'underscore'
	, 'backbone'
	, '../tools/tools'
	, '../models/model.abstract'
], function (_, Backbone, Tools, AbstractModel) {
	'use strict';

	var Model = AbstractModel.extend({
		defaults: {
			language: false
			, language_name: 'language_name'
			, version: '0.4.0'
			, barricade: 'barricade'
			, copyright: 'copyright'
			, control_menu: 'control_menu'
			, control_pass_turn: 'control_pass_turn'
			, control_pause_game: 'control_pause_game'
			, control_resume_game: 'control_resume_game'
			, control_reset_game: 'control_reset_game'
			, control_user_settings: 'control_user_settings'
			, end_title: 'end_title'
			, game_dice: 'game_dice'
			, game_dice_self: 'game_dice_self'
			, game_over: 'game_over'
			, game_over_self: 'game_over_self'
			, game_player_captured_barricade: 'game_player_captured_barricade'
			, game_player_captured_barricade_self: 'game_player_captured_barricade_self'
			, game_player_captured_player: 'game_player_captured_player'
			, game_player_captured_player_self: 'game_player_captured_player_self'
			, game_player_joins: 'game_player_joins'
			, game_player_joins_self: 'game_player_joins_self'
			, game_player_moved: 'game_player_moved'
			, game_player_moved_self: 'game_player_moved_self'
			, game_player_passes: 'game_player_passes'
			, game_player_passes_self: 'game_player_passes_self'
			, game_player_paused: 'game_player_paused'
			, game_player_paused_self: 'game_player_paused_self'
			, game_player_resumed: 'game_player_resumed'
			, game_player_resumed_self: 'game_player_resumed_self'
			, game_player_settings: 'game_player_settings'
			, game_player_settings_self: 'game_player_settings_self'
			, game_player_turn: 'game_player_turn'
			, game_player_turn_self: 'game_player_turn_self'
			, game_player_wins: 'game_player_wins'
			, game_player_wins_self: 'game_player_wins_self'
			, pause_title: 'pause_title'
			, rules: "rules"
			, rules_link: "rules_link"
			, settings_color: "settings_color"
			, settings_language: "settings_language"
			, settings_mapName: 'settings_mapName'
			, settings_mapName_2: 'settings_mapName_2'
			, settings_mapName_2_legend: 'settings_mapName_2_legend'
			, settings_mapName_3: 'settings_mapName_3'
			, settings_mapName_3_legend: 'settings_mapName_3_legend'
			, settings_mapName_4: 'settings_mapName_4'
			, settings_mapName_4_legend: 'settings_mapName_4_legend'
			, settings_name: 'settings_name'
			, settings_reset: 'settings_reset'
			, settings_submit: 'settings_submit'
			, settings_title: 'settings_title'
			, user_settings_title: "user_settings_title"
			, user_settings_submit: "user_settings_submit"
		}

		, getInfos: function () {
			return {
				value: this.get('language')
				, name: this.get('language_name')
			};
		}
	});

	return Model;
});
