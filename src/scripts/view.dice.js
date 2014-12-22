(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'tools'
		, 'view.abstract'
		, 'game.user'
	], function (_, Backbone, Tools, AbstractView, User) {
		'use strict';

		var View = AbstractView.extend({
			className: 'dice-component'

			, initialize: function (options) {
				_.bindAll(this, 'render', 'check');

				this.listenTo(this.model, 'change:dice', this.render);

				this.insertElement();
				this.render();

				return this;
			}

			, check: function () {
				if (
					this.model.get('dice') < this.model.get('diceMin')
					|| this.model.get('dice') > this.model.get('diceMax')
					|| User.storage.get('turn') !== this.model.get('turn')
				) {
					this.hide();
				}
				else {
					this.show();
				}

				return this;
			}

			, render: function () {
				this.empty();
				this.el.classList.remove('in');

				if (User.storage.get('turn') === this.model.get('turn')) {
					this.el.appendChild(document.createTextNode(this.model.get('dice')));

					this.el.classList.add('in');
				}

				this.check();

				return this;
			}
		});

		return View;
	});

})(window, document);
