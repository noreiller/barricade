(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'tools'
		, 'game.events'
		, 'view.abstract'
	], function (_, Backbone, Tools, Events, AbstractView) {
		'use strict';

		var View = AbstractView.extend({
			tagName: 'button'

			, events: {
				'click': 'control'
			}

			, initialize: function (options) {
				_.bindAll(this, 'render', 'control');

				this.listenTo(Events, 'game:language', this.render);

				this.render();

				return this;
			}

			, render: function () {
				this.empty();

				this.el.classList.add('button');
				this.el.classList.add(this.model.get('name'));

				this.el.appendChild(document.createTextNode(
					Tools.getI18n(this.model.get('label'))
				));

				return this;
			}

			, control: function () {
				Events.trigger(this.model.get('event')
					? this.model.get('event')
					: 'game:' + this.model.get('name')
				);

				return this;
			}
		});

		return View;
	});

})(window, document);
