(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'tools'
		, 'game.events'
		, 'game.user'
		, 'view.abstract'
		, 'text!../templates/user.html'
	], function (_, Backbone, Tools, Events, User, AbstractView, settingsTpl) {
		'use strict';

		var View = AbstractView.extend({
			'events': {
				'submit form': 'formSubmissionListener'
			}

			, template: _.template(settingsTpl)

			, initialize: function (options) {
				_.bindAll(this, 'render', 'formSubmissionListener', 'open');

				this.listenTo(Events, 'game:user:open', this.open);
				this.listenTo(Events, 'game:user:close', this.hide);

				this.hide();

				return this;
			}

			, render: function () {
				this.empty();

				this.el.innerHTML = this.template(User.storage.toJSON());

				return this;
			}

			, open: function () {
				this.render();
				this.show();

				return this;
			}

			, formSubmissionListener: function (event) {
				event.preventDefault();

				var values = {};
				var form = event.currentTarget;

				for (var i = 0; i < form.length; i++) {
					if (form[i].type === 'radio') {
						if (form[i].checked) {
							values[form[i].name] = form[i].value;
						}
					}
					else if (form[i].type === 'checked') {
						// if first value of this, simple check
						// otherwise create an array if also checked
					}
					else {
						values[form[i].name] = form[i].value;
					}
				}

				Events.trigger('game:user:update', values);

				this.hide();
			}
		});

		return View;
	});

})(window, document);
