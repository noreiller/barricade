(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'jquery'
		, 'easing-js'
		, 'tools'
		, 'game.events'
		, 'game.user'
		, 'view.abstract'
	], function (_, Backbone, $, Easing, Tools, Events, User, AbstractView) {
		'use strict';

		var View = AbstractView.extend({
			initialize: function (options) {
				this.loading = false;

				_.bindAll(this,
					'render'
					, 'updateSelectability'
					, 'updateColors'
					, 'move'
				);

				if (options.context) {
					this.context = options.context;
				}

				if (options.tileSize) {
					this.tileSize = options.tileSize;
				}

				if (options.parentView) {
					this.parentView = options.parentView;
				}

				this.listenTo(this.model, 'change:selected', this.updateSelectability);
				this.listenTo(this.model, 'change:color', this.updateColors);
				this.listenTo(this.model, 'destroy', this.close);
				this.listenTo(this.model, 'mutates', this.move);

				this.render();

				return this;
			}

			, render: function (clear, position) {
				if (this.loading && !position) {
					return this;
				}

				if (!position) {
					position = {};
				}

				this.context.save();

				if (clear) {
					this.clear(position);
				}

				var colorRgb = Tools.color.hexToRgb(this.model.get('color'));

				if (this.model.hasPiece()) {
					this.context.fillStyle = 'rgba('
						+ colorRgb.r + ','
						+ colorRgb.g + ','
						+ colorRgb.b + ','
						+ '0.6)'
					;
				}
				else {
					this.context.fillStyle = 'rgba('
						+ colorRgb.r + ','
						+ colorRgb.g + ','
						+ colorRgb.b + ','
						+ '0.15)'
					;
				}

				if (this.model.get('selected')) {
					this.context.strokeStyle = '#ff0000';
				}
				else {
					this.context.strokeStyle = this.model.get('color');
				}

				var offsetPixel = 0.5;
				var tileMargin = 5;

				this.context.fillRect(
					this.offsetLeft + (position.x || Math.floor(this.model.get('col') % User.storage.get('mapColCount') * this.tileSize)) + tileMargin + offsetPixel
					, this.offsetTop + (position.y || Math.floor(this.model.get('row') % User.storage.get('mapRowCount') * this.tileSize)) + tileMargin + offsetPixel
					, this.tileSize - (tileMargin * 2) - (offsetPixel * 2)
					, this.tileSize - (tileMargin * 2) - (offsetPixel * 2)
				);

				this.context.strokeRect(
					this.offsetLeft + (position.x || Math.floor(this.model.get('col') % User.storage.get('mapColCount') * this.tileSize)) + tileMargin + offsetPixel
					, this.offsetTop + (position.y || Math.floor(this.model.get('row') % User.storage.get('mapRowCount') * this.tileSize)) + tileMargin + offsetPixel
					, this.tileSize - (tileMargin * 2) - (offsetPixel * 2)
					, this.tileSize - (tileMargin * 2) - (offsetPixel * 2)
				);

				this.context.restore();

				return this;
			}

			, clear: function (position) {
				if (!position) {
					position = {};
				}

				this.context.clearRect(
					this.offsetLeft + (position.x || Math.floor(this.model.get('col') % User.storage.get('mapColCount') * this.tileSize))
					, this.offsetTop + (position.y || Math.floor(this.model.get('row') % User.storage.get('mapRowCount') * this.tileSize))
					, this.tileSize
					, this.tileSize
				);

				return this;
			}

			, move: function (previousAttributes) {
				this.loading = true;

				var self = this;
				var startTime;
				var duration = 500;

				var row = previousAttributes.row;
				var col = previousAttributes.col;

				var x = Math.floor(col % User.storage.get('mapColCount') * this.tileSize);
				var y = Math.floor(row % User.storage.get('mapColCount') * this.tileSize);

				var diffs = {
					row: self.model.get('row') - previousAttributes.row
					, col: self.model.get('col') - previousAttributes.col
				};

				function animate (timestamp) {
					if (!startTime) {
						startTime = timestamp;
					}

					// Erase the rendering at the current position
					self.clear({
						x: x
						, y: y
					});

					// Draw the capture at the current position
					self.context.drawImage(
						captureImg
						, self.offsetLeft + x
						, self.offsetTop + y
						, self.tileSize
						, self.tileSize
						, self.offsetLeft + x
						, self.offsetTop + y
						, self.tileSize
						, self.tileSize
					);

					// Calculate current position
					var timeLeft = timestamp - startTime;

					col = (diffs.col * Easing.easeInOutQuad(timeLeft / duration)) + previousAttributes.col;
					row = (diffs.row * Easing.easeInOutQuad(timeLeft / duration)) + previousAttributes.row;

					x = Math.floor(col % User.storage.get('mapColCount') * self.tileSize);
					y = Math.floor(row % User.storage.get('mapColCount') * self.tileSize);

					self.render(false, {
						x: x
						, y: y
					});

					if (timeLeft > duration) {
						self.parentView.renderTileId(previousAttributes.cid);
						self.loading = false;
						Events.trigger('game:move:rendered', previousAttributes.pieceId);
					}
					else {
						window.requestAnimFrame(animate);
					}
				}

				var captureData = this.parentView.el.toDataURL('image/png');
				var captureImg = new window.Image();

				captureImg.onload = function () {
					window.requestAnimFrame(animate);
				};

				captureImg.src = captureData;

				return this;
			}

			, updateData: function (data) {
				this.tileSize = data.tileSize;
				this.offsetLeft = data.offsetLeft;
				this.offsetTop = data.offsetTop;

				return this;
			}

			, updateSelectability: function () {
				if (!this.loading) {
					this.render(true);
				}

				return this;
			}

			, updateColors: function () {
				if (!this.loading) {
					this.render(true);
				}

				return this;
			}
		});

		return View;
	});

})(window, document);
