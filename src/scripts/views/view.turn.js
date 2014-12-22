(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, '../tools/tools'
		, '../game/game.events'
		, '../game/game.user'
		, '../views/view.abstract'
	], function (_, Backbone, Tools, Events, User, AbstractView) {
		'use strict';

		var View = AbstractView.extend({
			tagName: 'button'

			, className: 'turn-component control-component'

			, events: {
				'click': 'clickListener'
			}

			, initialize: function (options) {
				_.bindAll(this, 'render', 'check');

				this.listenTo(this.model, 'change:turn', this.check);
				this.listenTo(Events, 'game:turn', this.render);
				this.listenTo(Events, 'game:user', this.render);

				this.insertElement();
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
				if (User.storage.get('turn') === this.model.get('turn') && playerInfos) {
					this.empty();

					var rgb = Tools.color.hexToRgb(playerInfos.color);

					this.empty(this.el);

					var icon = document.createElement('span');
					icon.classList.add('icon');
					icon.classList.add('icon-color');
					icon.style.backgroundColor = playerInfos.color;

					var name = document.createElement('span');
					name.classList.add('label');
					name.appendChild(document.createTextNode(playerInfos.name));

					this.el.appendChild(icon);
					this.el.appendChild(name);
				}

				this.check();

				return this;
			}

			, clickListener: function () {
				Events.trigger('game:panel:user');

				return this;
			}
		});

		return View;
	});

})(window, document);
