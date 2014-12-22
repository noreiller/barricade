(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, '../tools/tools'
		, '../game/game.events'
		, '../game/game.user'
		, '../views/view.abstract'
		, '../views/view.place.2d'
	], function (_, Backbone, Tools, Events, User, AbstractView, PlaceView) {
		'use strict';

		var View = AbstractView.extend({
			className: 'board-component'

			, tagName: 'canvas'

			, offsets: {
				top: 100
				, bottom: 50
				, left: 10
				, right: 10
			}

			, events: {
				'click': 'clickListener'
				// , 'mousedown': 'mousedownListener'
			}

			, initialize: function (options) {
				_.bindAll(this
					, 'render'
					, 'renderTile'
					, 'updateViewport'
					, 'updateData'
					, 'clickListener'
				);

				this.context = this.el.getContext('2d');
				this.views = new Backbone.ChildViewContainer();

				this.listenTo(this.collection, 'reset', this.render);
				this.listenTo(this.collection, 'add', this.renderTile);
				this.listenTo(Events, 'game:played', this.render);
				this.listenTo(Events, 'window:resize', this.renderAll);

				this.insertElement(true);
				this.renderAll();

				return this;
			}

			, renderAll: function () {
				this.updateViewport();
				this.render();

				return this;
			}

			, render: function () {
				this.updateViewport();
				this.show();

				this.clearAll();

				_.each(this.collection.models, this.renderTile, this);

				return this;
			}

			, clearAll: function () {
				this.context.clearRect(0, 0, this.el.width, this.el.height);

				return this;
			}

			, renderTile: function (item) {
				var itemView = this.views.findByCustom(item.cid);

				if (!itemView) {
					itemView = new PlaceView({
						model: item
						, context: this.context
						, tileSize: this.tileSize
						, parentView: this
					});

					this.views.add(itemView, item.cid);
				}

				itemView.render();

				return this;
			}

			, renderTileId: function (cid) {
				var itemView = this.views.findByCustom(cid);

				if (itemView) {
					itemView.render(true);
				}

				return this;
			}

			, clearTileId: function (cid) {
				var itemView = this.views.findByCustom(cid);

				if (itemView) {
					itemView.clear();
				}

				return this;
			}

			, updateViewport: function () {
				this.updateData();

				this.el.title = User.storage.get('mapColCount') + 'x' + User.storage.get('mapRowCount');
				this.el.width = this.el.parentNode.offsetWidth - this.el.offsetLeft;
				this.el.height = this.el.parentNode.offsetHeight - this.el.offsetTop;

				return this;
			}

			, updateData: function () {
				this.tileSize = 1;

				if (User.storage.get('mapRowCount') && User.storage.get('mapColCount')) {
					this.tileSize = Math.min(
						Math.floor((this.el.offsetWidth - this.offsets.left - this.offsets.right) / User.storage.get('mapColCount') * User.storage.get('zoom'))
						, Math.floor((this.el.offsetHeight - this.offsets.top - this.offsets.bottom) / User.storage.get('mapRowCount') * User.storage.get('zoom'))
					);

					this.offsetLeft = Math.floor((this.el.offsetWidth - this.tileSize * User.storage.get('mapColCount')) / 2);

					this.views.call('updateData', {
						tileSize: this.tileSize
						, offsetLeft: this.offsetLeft
						, offsetTop: this.offsets.top
					});
				}

				return this;
			}

			// , mousedownListener: function (event) {
			// 	var x = event.clientX - this.el.offsetLeft - this.offsetLeft;
			// 	var y = event.clientY - this.el.offsetTop - this.offsets.top;

			// 	this.tileClick = {
			// 		row: Math.floor(y / this.tileSize)
			// 		, col: Math.floor(x / this.tileSize)
			// 	};

			// 	return this;
			// }

			, clickListener: function (event) {
				var x = event.clientX - this.el.offsetLeft - this.offsetLeft;
				var y = event.clientY - this.el.offsetTop - this.offsets.top;

				var tile = this.collection.findWhere({
					row: Math.floor(y / this.tileSize)
					, col: Math.floor(x / this.tileSize)
				});

				if (tile) {
					Events.trigger('game:selection', Math.floor(y / this.tileSize), Math.floor(x / this.tileSize));
				}

				return this;
			}
		});

		return View;
	});

})(window, document);
