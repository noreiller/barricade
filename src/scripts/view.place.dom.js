(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'jquery'
		, 'tools'
		, 'game.events'
		, 'game.user'
		, 'view.abstract'
	], function (_, Backbone, $, Tools, Events, User, AbstractView) {
		'use strict';

		var View = AbstractView.extend({
			'events': {
				'click': 'selectPlace'
			}

			, initialize: function (options) {
				_.bindAll(this,
					'render'
					, 'createPath'
					, 'createPiece'
					, 'updateViewport'
					, 'selectPlace'
					, 'updateMoveability'
					, 'updateSelectability'
					, 'updateColors'
					, 'move'
				);

				if (options.parentNode) {
					this.parentNode = options.parentNode;
				}

				this.listenTo(this.model, 'change:moveable', this.updateMoveability);
				this.listenTo(this.model, 'change:selected', this.updateSelectability);
				this.listenTo(this.model, 'destroy', this.close);
				this.listenTo(this.model, 'mutates', this.move);

				this.listenTo(Events, 'game:user', this.updateColors);

				this.render();

				return this;
			}

			, render: function () {
				this.empty();

				this.updateViewport();

				this.el.title = this.model.get('col') + ':' + this.model.get('row');
				this.parentNode.appendChild(this.el);

				if (this.model.isPath() && !this.path) {
					this.createPath();
				}

				if (this.model.hasPiece()) {
					this.createPiece();
				}

				return this;
			}

			, move: function (previousAttributes) {
				var element = document.getElementById(previousAttributes.pieceId);

				if (element) {
					element.classList.remove('selected');
					element.classList.remove('draggable');

					$(element).animate({
						left: (Math.floor(this.model.get('col') % User.storage.get('mapColCount')) * this.getPlaceSize()) + 'px'
						, top: (Math.floor(this.model.get('row') % User.storage.get('mapRowCount')) * this.getPlaceSize()) + 'px'
					}, function () {
						Events.trigger('game:move:rendered', previousAttributes.pieceId);
					});
				}

				return this;
			}

			, updateViewport: function (options) {
				this.el.style.width = this.getPlaceSize() + 'px';
				this.el.style.height = this.getPlaceSize() + 'px';

				this.el.style.left = (Math.floor(this.model.get('col') % User.storage.get('mapColCount')) * this.getPlaceSize()) + 'px';
				this.el.style.top = (Math.floor(this.model.get('row') % User.storage.get('mapRowCount')) * this.getPlaceSize()) + 'px';

				if (this.getPieceElement()) {
					this.getPieceElement().style.width = this.getPlaceSize() + 'px';
					this.getPieceElement().style.height = this.getPlaceSize() + 'px';

					this.getPieceElement().style.left = (Math.floor(this.model.get('col') % User.storage.get('mapColCount')) * this.getPlaceSize()) + 'px';
					this.getPieceElement().style.top = (Math.floor(this.model.get('row') % User.storage.get('mapRowCount')) * this.getPlaceSize()) + 'px';
				}

				return this;
			}

			, createPath: function () {
				this.el.classList.add('path');

				if (this.model.isGoal()) {
					this.el.classList.add('goal');
				}
				else {
					this.el.classList.remove('goal');
				}

				if (this.model.isBarricade()) {
					this.el.classList.add('barricade');
				}
				else {
					this.el.classList.remove('barricade');
				}

				if (this.model.isHome()) {
					this.el.classList.add('home');
				}
				else {
					this.el.classList.remove('home');
				}

				if (this.model.get('color') && this.model.isHome()) {
					this.el.style.color = this.model.get('color');
				}
				else {
					this.el.style.color = '';
				}

				return this;
			}

			, createPiece: function () {
				var element = document.createElement('div');

				element.id = this.model.get('pieceId');
				element.classList.add('piece');

				if (this.model.hasBarricade()) {
					element.classList.add('barricade');
				}

				if (this.model.hasPlayer()) {
					element.classList.add(this.model.isAI() ? 'ai' : 'player');
				}

				element.appendChild(document.createTextNode(this.model.get('value')));

				if (this.model.get('color') && this.model.hasPlayer()) {
					element.dataset.color = this.model.get('color');
					element.style.color = this.model.get('color');
				}

				element.style.width = this.getPlaceSize() + 'px';
				element.style.height = this.getPlaceSize() + 'px';

				element.style.left = (Math.floor(this.model.get('col') % User.storage.get('mapColCount')) * this.getPlaceSize()) + 'px';
				element.style.top = (Math.floor(this.model.get('row') % User.storage.get('mapRowCount')) * this.getPlaceSize()) + 'px';

				this.parentNode.appendChild(element);

				return this;
			}

			, updateMoveability: function () {
				if (this.model.get('moveable') && this.getPieceElement()) {
					this.el.classList.add('draggable');
					this.getPieceElement().classList.add('draggable');
				}
				else {
					this.el.classList.remove('draggable');

					if (this.getPieceElement()) {
						this.getPieceElement().classList.remove('draggable');
					}
				}

				return this;
			}

			, updateSelectability: function () {
				if (this.model.get('selected') && this.getPieceElement()) {
					this.getPieceElement().classList.add('selected');
				}
				else if (this.getPieceElement()) {
					this.getPieceElement().classList.remove('selected');
				}

				return this;
			}

			, updateColors: function () {
				if (this.getPieceElement() && this.model.get('value') === User.storage.get('turn')) {
					this.getPieceElement().dataset.color = User.storage.get('color');
					this.getPieceElement().style.color = User.storage.get('color');
				}

				if (this.model.isHome() && this.model.get('value') === User.storage.get('turn')) {
					this.el.style.color = User.storage.get('color');
				}

				return this;
			}

			, selectPlace: function () {
				Events.trigger('game:selection', this.model.get('row'), this.model.get('col'));

				return this;
			}

			, onClose: function () {
				if (this.getPieceElement()) {
					this.getPieceElement().remove();
				}

				return this;
			}

			, getPieceElement: function () {
				return document.getElementById(this.model.get('pieceId'));
			}

			, getPlaceSize: function () {
				var placeSize = 1;

				if (User.storage.get('mapRowCount') && User.storage.get('mapColCount')) {
					placeSize = Math.min(
						Math.floor(this.parentNode.offsetWidth / (User.storage.get('mapColCount')))
						, Math.floor(this.parentNode.offsetHeight / (User.storage.get('mapRowCount')))
					);

				}

				return placeSize;
			}
		});

		return View;
	});

})(window, document);
