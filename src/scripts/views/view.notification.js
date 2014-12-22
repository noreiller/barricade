(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, '../tools/tools'
		, '../game/game.events'
		, '../views/view.abstract'
		, '../game/game.user'
	], function (_, Backbone, Tools, Events, AbstractView, User) {
		'use strict';

		var View = AbstractView.extend({
			className: 'notification-component'

			, events: {
				'click': 'toggle'
			}

			, initialize: function () {
				_.bindAll(this, 'notify', 'onReset');

				this.listenTo(Events, 'game:notify', this.notify);

				this.insertElement();

				return this;
			}

			, toggle: function () {
				this.el.classList.toggle('opened');
				this.el.scrollTop = 0;
			}

			, onReset: function () {
				if (this.el.classList.contains('opened')) {
					this.toggle();
				}
			}

			, notify: function (message, playerInfos) {
				var args = arguments;
				if (playerInfos.value === User.storage.get('turn')) {
					args[0] += '_self';
				}

				this.show();

				var bullet = document.createElement('div');
				bullet.classList.add('bullet');
				bullet.style.color = playerInfos.color;
				bullet.style.backgroundColor = playerInfos.color;

				var element = document.createElement('div');
				element.classList.add('message');

				element.appendChild(bullet);
				element.appendChild(document.createTextNode(
					Tools.getI18n.apply(Tools, arguments)
				));

				if (this.el.firstChild) {
					this.el.firstChild.parentNode.insertBefore(element, this.el.firstChild);
				}
				else {
					this.el.appendChild(element);
				}

				return this;
			}
		});

		return View;
	});

})(window, document);
