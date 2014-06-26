define([
	'underscore'
	, 'backbone'
	, 'tools'
	, 'model.abstract'
], function (_, Backbone, Tools, AbstractModel) {
	'use strict';

	var Model = AbstractModel.extend({
		defaults: {
			language: false
			, language_name: 'language_name'
			, version: '0.3'
			, barricade: 'barricade'
			, control_pass_turn: 'control_pass_turn'
			, control_pause_game: 'control_pause_game'
			, control_resume_game: 'control_resume_game'
			, control_reset_game: 'control_reset_game'
			, control_user_settings: 'control_user_settings'
			, game_dice: 'game_dice'
			, game_player_captured_barricade: 'game_player_captured_barricade'
			, game_player_captured_player: 'game_player_captured_player'
			, game_player_joins: 'game_player_joins'
			, game_player_moved: 'game_player_moved'
			, game_player_passes: 'game_player_passes'
			, game_player_paused: 'game_player_paused'
			, game_player_resumed: 'game_player_resumed'
			, game_player_turn: 'game_player_turn'
			, game_player_wins: 'game_player_wins'
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
