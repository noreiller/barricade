define([
	'underscore'
], function (_) {
	'use strict';

	var I18N = {
		language: "fr"
		, language_name: "Français"
		, barricade: "barricade"
		, control_pass_turn: "Passer son tour"
		, control_pause_game: "Mettre le jeu en pause"
		, control_resume_game: "Remettre le jeu en marche"
		, control_reset_game: "Redémarrer le jeu"
		, control_user_settings: "Afficher les paramètres utilisateur"
		, game_dice: '%name a lancé le dé et a obtenu %0.'
		, game_dice_self: 'Vous avez lancé le dé et avez obtenu %0.'
		, game_player_captured_barricade: '%name a capturé une barricade.'
		, game_player_captured_barricade_self: 'Vous avez capturé une barricade.'
		, game_player_captured_player: '%name a capturé un adversaire.'
		, game_player_captured_player_self: 'Vous avez capturé un adversaire.'
		, game_player_joins: "%name a rejoint la partie."
		, game_player_joins_self: "Vous avez rejoint la partie."
		, game_player_moved: "%name a joué."
		, game_player_moved_self: "Vous avez joué."
		, game_player_passes: '%name a passé son tour.'
		, game_player_passes_self: 'Vous avez passé votre tour.'
		, game_player_paused: '%name a mis le jeu en pause.'
		, game_player_paused_self: 'Vous avez mis le jeu en pause.'
		, game_player_resumed: '%name a remis le jeu en marche.'
		, game_player_resumed_self: 'Vous avez remis le jeu en marche.'
		, game_player_turn: "C'est le tour de %name."
		, game_player_turn_self: "C'est votre tour."
		, game_player_wins: "%name a gagné la partie."
		, game_player_wins_self: "Vous avez gagné la partie."
		, pause_title: "Pause"
		, rules: "Règles du jeu"
		, rules_link: "https://fr.wikipedia.org/wiki/Barricade_%28jeu%29#D.C3.A9roulement"
		, settings_color: "Couleur"
		, settings_language: "Langue"
		, settings_mapName: "Combien d'ordinateurs voulez-vous combattre ?"
		, settings_mapName_2: "1 ordinateur"
		, settings_mapName_2_legend: "(mode mauviette)"
		, settings_mapName_3: "2 ordinateurs"
		, settings_mapName_3_legend: "(pas si mauviette que ça après tout)"
		, settings_mapName_4: "3 ordinateurs"
		, settings_mapName_4_legend: "(mode grande bataille !)"
		, settings_name: "Nom"
		, settings_reset: "Annuler"
		, settings_submit: "C'est parti!"
		, settings_title: "Choisissez vos réglages"
		, user_settings_title: "Paramètres utilisateur"
		, user_settings_submit: "Ok"
	};

	return I18N;
});
