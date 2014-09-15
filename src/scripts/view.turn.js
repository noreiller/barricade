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
			initialize: function (options) {
				_.bindAll(this, 'render', 'check');

				this.listenTo(this.model, 'change:turn', this.check);
				this.listenTo(Events, 'game:turn', this.render);
				this.listenTo(Events, 'game:user', this.render);

				this.render();

				return this;
			}

			, check: function () {
				if (this.model.get('turn') > -1) {
					this.show();
				}
				else {
					this.hide();
				}

				return this;
			}

			, render: function (playerInfos) {
				if (playerInfos) {
					this.empty();

					var rgb = Tools.color.hexToRgb(playerInfos.color);

					this.empty(this.el);

					var el = document.createElement('div');
					el.classList.add('color');

					el.style.backgroundColor = playerInfos.color;

					this.el.appendChild(el);
					this.el.appendChild(document.createTextNode(playerInfos.name));
				}

				this.check();

				return this;
			}
		});

		return View;
	});

})(window, document);
