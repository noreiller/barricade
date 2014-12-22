(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'tools'
		, 'view.control'
		, 'game.user'
	], function (_, Backbone, Tools, ControlView, User) {
		'use strict';

		var View = ControlView.extend({
			className: 'pass-component control-component'

			, initialize: function (options) {
				ControlView.prototype.initialize.apply(this, arguments);

				_.bindAll(this, 'render', 'check');

				this.listenTo(this.model, 'change:turn', this.check);

				this.insertElement();
				this.render();

				return this;
			}

			, check: function () {
				if (User.storage.get('turn') !== this.model.get('turn')) {
					this.hide();
				}
				else {
					this.show();
				}

				return this;
			}
		});

		return View;
	});

})(window, document);
