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
			initialize: function (options) {
				_.bindAll(this, 'render', 'renderItem', 'pause', 'resume');

				this.views = new Backbone.ChildViewContainer();

				this.listenTo(Events, 'game:pause', this.pause);
				this.listenTo(Events, 'game:resume', this.resume);

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

			, pause: function () {
				try {
					this.views.findByCustom('pause').hide();
					this.views.findByCustom('resume').show();
				}
				catch (e) {}
			}

			, resume: function () {
				this.show();

				try {
					this.views.findByCustom('resume').hide();
					this.views.findByCustom('pause').show();
				}
				catch (e) {}
			}
		});

		return View;
	});

})(window, document);
