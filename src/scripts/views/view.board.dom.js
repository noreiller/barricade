(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, '../tools/tools'
		, '../game/game.events'
		, '../game/game.user'
		, '../views/view.abstract'
		, '../views/view.place.dom'
	], function (_, Backbone, Tools, Events, User, AbstractView, PlaceView) {
		'use strict';

		var View = AbstractView.extend({
			className: 'board-component'

			, initialize: function (options) {
				_.bindAll(this
					, 'render'
					, 'renderItem'
					, 'updateViewport'
				);

				this.views = new Backbone.ChildViewContainer();

				this.listenTo(this.collection, 'reset', this.render);
				this.listenTo(this.collection, 'add', this.renderItem);
				this.listenTo(Events, 'window:resize', this.updateViewport);

				this.insertElement();
				this.render();

				return this;
			}

			, render: function () {
				this.empty();
				this.show();

				_.each(this.collection.models, this.renderItem, this);

				return this;
			}

			, renderItem: function (item) {
				var itemView = new PlaceView({
					model: item
					, parentNode: this.el
				});

				this.views.add(itemView, item.cid);

				return this;
			}

			, updateViewport: function () {
				this.el.title = User.storage.get('mapColCount') + 'x' + User.storage.get('mapRowCount');

				if (!User.storage.get('mapRowCount') || !User.storage.get('mapColCount')) {
					this.hide();
				}
				else {
					this.show();

					this.views.apply('updateViewport');
				}

				return this;
			}
		});

		return View;
	});

})(window, document);
