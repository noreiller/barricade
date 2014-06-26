(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'tools'
		, 'game.events'
		, 'view.abstract'
		, 'view.place'
	], function (_, Backbone, Tools, Events, AbstractView, PlaceView) {
		'use strict';

		var View = AbstractView.extend({
			initialize: function (options) {
				_.bindAll(this
					, 'render'
					, 'renderItem'
					, 'updateData'
					, 'updateViewport'
					, 'updatePlaceSize'
				);

				this.data = {
					rows: options.rows
					, cols: options.cols
					, size: 1
				};

				this.views = new Backbone.ChildViewContainer();

				this.listenTo(this.collection, 'reset', this.render);
				this.listenTo(this.collection, 'add', this.renderItem);
				this.listenTo(Events, 'window:resize', this.updateViewport);

				this.updatePlaceSize();
				this.render();

				return this;
			}

			, updateData: function (options) {
				this.data.rows = options.rows || 0;
				this.data.cols = options.cols || 0;

				this.updateViewport();

				return this;
			}

			, updatePlaceSize: function () {
				if (this.data.rows && this.data.cols) {
					this.data.size = Math.min(
						Math.floor(this.el.offsetWidth / (this.data.rows + 2))
						, Math.floor(this.el.offsetHeight / (this.data.cols + 2))
					);
				}

				return this;
			}

			, render: function () {
				this.empty();

				_.each(this.collection.models, this.renderItem, this);

				return this;
			}

			, renderItem: function (item) {
				var itemView = new PlaceView({
					model: item
					, parentNode: this.el
					, dimension: {
						width: this.data.size
						, height: this.data.size
					}
					, position: {
						top: Math.floor(item.get('row') % this.data.rows)
						, left: Math.floor(item.get('col') % this.data.cols)
					}
					, rows: this.data.rows
					, cols: this.data.cols
				});

				this.views.add(itemView, item.cid);

				return this;
			}

			, updateViewport: function () {
				this.el.title = this.data.cols + 'x' + this.data.rows;

				if (!this.data.rows || !this.data.cols) {
					this.hide();
				}
				else {
					this.show();

					this.updatePlaceSize();

					this.views.each(function (itemView) {
						itemView.updateData({
							dimension: {
								width: this.data.size
								, height: this.data.size
							}
							, position: {
								top: Math.floor(itemView.model.get('row') % this.data.rows)
								, left: Math.floor(itemView.model.get('col') % this.data.cols)
							}
							, rows: this.data.rows
							, cols: this.data.cols
						});
					}, this);
				}

				return this;
			}
		});

		return View;
	});

})(window, document);
