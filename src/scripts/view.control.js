(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'tools'
		, 'game.events'
		, 'view.abstract'
		, 'text!../templates/control.html'
	], function (_, Backbone, Tools, Events, AbstractView, controlTpl) {
		'use strict';

		var View = AbstractView.extend({
			tagName: 'button'
			, className: 'control'

			, template: _.template(controlTpl)

			, events: {
				'click': 'controlClickListener'
			}

			, initialize: function (options) {
				_.bindAll(this, 'render', 'controlClickListener', 'pause', 'resume');

				this.listenTo(Events, 'game:language', this.render);
				this.listenTo(Events, 'game:pause', this.pause);
				this.listenTo(Events, 'game:resume', this.resume);

				this.render();

				return this;
			}

			, render: function () {
				this.empty();

				this.el.value = this.model.get('event');
				this.el.title = Tools.getI18n(this.model.get('label'));

				this.el.innerHTML = this.template(_.extend(this.model.toJSON(), {
					label: this.el.title
				}));

				return this;
			}

			, controlClickListener: function (event) {
				Events.trigger(event.currentTarget.value);

				return this;
			}

			, pause: function () {
				if (['resume', 'pass'].indexOf(this.model.get('name')) !== -1) {
					this.show();
				}
				else {
					this.hide();
				}
			}

			, resume: function () {
				if (['pause', 'pass'].indexOf(this.model.get('name')) !== -1) {
					this.show();
				}
				else {
					this.hide();
				}
			}
		});

		return View;
	});

})(window, document);
