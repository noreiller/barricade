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
			events: {
				'click': 'toggle'
			}
			, initialize: function () {
				_.bindAll(this, 'notify', 'onReset');

				this.listenTo(Events, 'game:notify', this.notify);

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

			, notify: function () {
				this.show();

				var element = document.createElement('div');

				element.classList.add('message');
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
