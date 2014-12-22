(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, '../views/view.board.2d'
		, '../views/view.board.dom'
	], function (_, Backbone, Board2dView, BoardDomView) {
		'use strict';

		// return BoardDomView;
		return Board2dView;
	});

})(window, document);
