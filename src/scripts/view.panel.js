(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'tools'
		, 'game.events'
		, 'game.user'
		, 'view.abstract'
		, 'view.pause'
		, 'view.settings'
		, 'view.user'
	], function (_, Backbone, Tools, Events, User, AbstractView, PauseView, SettingsView, UserView) {
		'use strict';

		var View = AbstractView.extend({
			'events': {
				'submit form': 'formSubmissionListener'
				, 'click form [type=reset]': 'formResetListener'
				, 'change form [name=language]': 'languageChangeListener'
				, 'click button.control': 'controlClickListener'
			}

			, initialize: function (options) {
				_.bindAll(this
					, 'render'
					, 'addViews'
					, 'openPause'
					, 'openSettings'
					, 'openUser'
					, 'formSubmissionListener'
					, 'formResetListener'
					, 'languageChangeListener'
					, 'controlClickListener'
				);

				this.views = new Backbone.ChildViewContainer();
				this.addViews({
					'pause': PauseView
					, 'settings': SettingsView
					, 'user': UserView
				});

				this.listenTo(Events, 'game:language', this.render);
				this.listenTo(Events, 'game:panel:pause', this.openPause);
				this.listenTo(Events, 'game:pause', this.openPause);
				this.listenTo(Events, 'game:panel:settings', this.openSettings);
				this.listenTo(Events, 'game:panel:user', this.openUser);
				this.listenTo(Events, 'game:resume', this.hide);

				this.hide();

				return this;
			}

			, addViews: function (views) {
				_.each(views, function (ItemView, ind) {
					var newView = new ItemView();
					this.views.add(newView, ind);
				}, this);
			}

			, render: function (panel) {
				if (!panel && !this.panel) {
					return this;
				}
				else if (!panel && this.panel) {
					panel = this.panel;
				}
				else {
					this.panel = panel;
				}

				this.empty();

				try {
					var view = this.views.findByCustom(panel);
					view.render();
					this.el.appendChild(view.el);
					this.delegateEvents(this.events);
					this.show();
				}
				catch (e) {
					Events.trigger('game:error', e);
				}

				return this;
			}

			, openPause: function () {
				this.render('pause');

				return this;
			}

			, openSettings: function () {
				this.render('settings');

				return this;
			}

			, openUser: function () {
				this.render('user');

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
					else if (form[i].type === 'checkbox') {
						// @todo if first value of this, simple check
						// otherwise create an array if also checked
					}
					else {
						values[form[i].name] = form[i].value;
					}
				}

				Events.trigger('game:' + form.getAttribute('name') + ':update', values);

				this.hide();

				return this;
			}

			, formResetListener: function (event) {
				this.hide();

				return this;
			}

			, languageChangeListener: function (event) {
				Events.trigger('game:user:language', event.currentTarget.value);

				return this;
			}

			, controlClickListener: function (event) {
				Events.trigger(event.currentTarget.value);

				return this;
			}

			, onHide: function () {
				if (this.panel) {
					this.undelegateEvents();
					this.empty();
					this.panel = false;

					Events.trigger('game:resume');
				}

				return this;
			}
		});

		return View;
	});

})(window, document);
