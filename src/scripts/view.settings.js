(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'tools'
		, 'game.events'
		, 'game.user'
		, 'view.abstract'
		, 'text!../templates/settings.html'
	], function (_, Backbone, Tools, Events, User, AbstractView, settingsTpl) {
		'use strict';

		var View = AbstractView.extend({
			'events': {
				'submit form': 'formSubmissionListener'
				, 'change form [name=language]': 'languageChangeListener'
			}

			, template: _.template(settingsTpl)

			, initialize: function (options) {
				_.bindAll(this, 'render', 'formSubmissionListener', 'languageChangeListener', 'checkOpen', 'open');

				this.listenTo(Events, 'game:language', this.checkOpen);
				this.listenTo(Events, 'game:settings:open', this.open);
				this.listenTo(Events, 'game:settings:close', this.hide);

				this.render();
				this.hide();

				return this;
			}

			, render: function () {
				this.empty();

				this.el.innerHTML = this.template({
					i18n: User.storage.get('dict')
					, languages: User.storage.get('languages')
				});

				return this;
			}

			, checkOpen: function () {
				if (this.el.classList.contains('set')) {
					this.open();
				}

				return this;
			}

			, open: function () {
				this.render();
				this.show();

				return this;
			}

			, languageChangeListener: function (event) {
				Events.trigger('game:user:language', event.currentTarget.value);

				return this;
			}

			, formSubmissionListener: function (event) {
				event.preventDefault();

				var data = {};

				// @todo loop FORM tag array and check if the name of the field is in the settings
				_.filter(_.keys(this.model.defaults), function (item, ind) {
					var element = this.el.querySelector('[name="' + item + '"]');

					if (element && element.type.toLowerCase() === 'radio') {
						_.each(this.el.querySelectorAll('[name="' + item + '"]'), function (input) {
							if (input.checked) {
								data[item] = input.value;
							}
						}, this);
					}
					else if (element) {
						data[item] = element.value;
					}
				}, this);

				this.model.set(data, { validate: true });
			}
		});

		return View;
	});

})(window, document);
