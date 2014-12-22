(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, '../tools/tools'
		, '../models/model.i18n'
	], function (_, Backbone, Tools, I18nModel) {
		'use strict';

		var Collection = Backbone.Collection.extend({
			model: I18nModel

			, getLanguage: function (language) {
				return this.findWhere({
					language: language
				});
			}

			, getAvailableLanguages: function () {
				var languages = [];

				_.each(this.models, function (language) {
					languages.push(language.getInfos());
				}, this);

				return languages;
			}

			, hasLanguage: function (language) {
				return !!this.getLanguage(language);
			}

			, detectLanguage: function () {
				var current;

				if (this.hasLanguage(window.navigator.language)) {
					current = window.navigator.language;
				}
				else {
					_.each(window.navigator.languages, function (language) {
						if (!current && this.hasLanguage(language)) {
							current = language;
						}
					}, this);
				}

				return current || 'en';
			}

			, getDetectedLanguage: function () {
				return this.findWhere({
					language: this.detectLanguage()
				});
			}
		});

		return Collection;
	});

})(window, document);
