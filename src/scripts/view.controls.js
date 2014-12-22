(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'tools'
		, 'game.events'
		, 'view.abstract'
		, 'view.control'
	], function (_, Backbone, Tools, Events, AbstractView, ControlView) {
		'use strict';

		var View = AbstractView.extend({
			className: 'controls-component'

			, initialize: function (options) {
				_.bindAll(this, 'render', 'renderItem');

				this.views = new Backbone.ChildViewContainer();

				this.listenTo(Events, 'game:pause', this.hide);
				this.listenTo(Events, 'game:resume', this.show);

				this.insertElement();
				this.render();

				return this;
			}

			, render: function () {
				this.empty();
				this.hide();

				_.each(this.collection.models, this.renderItem, this);

				return this;
			}

			, renderItem: function (item, i) {
				var itemView = new ControlView({
					model: item
				});

				this.el.appendChild(itemView.el);

				this.views.add(itemView, item.get('name'));

				return this;
			}
		});

		return View;
	});

})(window, document);
