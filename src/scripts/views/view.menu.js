(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, '../views/view.control'
		, '../views/view.board.dom'
	], function (_, Backbone, ControlView) {
		'use strict';

		return ControlView.extend({
			className: 'menu-component control-component'

			, initialize: function () {
				ControlView.prototype.initialize.apply(this, arguments);
				this.insertElement();
			}
		});
	});

})(window, document);
