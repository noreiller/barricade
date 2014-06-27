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
			initialize: function (options) {
				_.bindAll(this, 'render');

				this.listenTo(this.model, 'change:dice', this.render);

				this.render();

				return this;
			}

			, render: function () {
				this.empty();

				this.el.appendChild(document.createTextNode(this.model.get('dice')));

				if (
					this.model.get('dice') < this.model.get('diceMin')
					|| this.model.get('dice') > this.model.get('diceMax')
				) {
					this.hide();
				}
				else {
					this.show();

					this.el.classList.remove('in');

					if (User.storage.get('turn') === this.model.get('turn')) {
						this.el.classList.add('in');
					}
				}

				return this;
			}
		});

		return View;
	});

})(window, document);
