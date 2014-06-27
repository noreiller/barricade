define([
	'underscore'
], function (_) {
	'use strict';

	var I18N = {
		language: "en"
		, language_name: "English"
		, barricade: "barricade"
		, control_pass_turn: "Pass its turn"
		, control_pause_game: "Set the game on pause"
		, control_resume_game: "Resume the game"
		, control_reset_game: "Reset the game"
		, control_user_settings: "Show user settings"
		, game_dice: '%name rolled the dice and got %0.'
		, game_player_captured_barricade: '%name captured a barricade.'
		, game_player_captured_player: '%name captured an opponent.'
		, game_player_joins: "%name joined the game."
		, game_player_moved: "%name played."
		, game_player_passes: "%name passed its turn."
		, game_player_paused: '%name set the game on pause.'
		, game_player_resumed: '%name resumed the game.'
		, game_player_turn: "The turn passed to %name."
		, game_player_wins: "%name won the game."
		, pause_title: "Pause"
		, rules: "Rules of the game"
		, rules_link: "https://en.wikipedia.org/wiki/Malefiz#Rules"
		, settings_color: "Color"
		, settings_language: "Language"
		, settings_mapName: "How many computers do you want to fight ?"
		, settings_mapName_2: "1 computer"
		, settings_mapName_2_legend: "(mode coward)"
		, settings_mapName_3: "2 computers"
		, settings_mapName_3_legend: "(not so coward after all)"
		, settings_mapName_4: "3 computers"
		, settings_mapName_4_legend: "(mode big battle!)"
		, settings_name: "Name"
		, settings_reset: "Cancel"
		, settings_submit: "Go!"
		, settings_title: "Choose your settings"
		, user_settings_title: "User settings"
		, user_settings_submit: "Ok"
	};

	return I18N;
});
