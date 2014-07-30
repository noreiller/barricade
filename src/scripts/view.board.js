(function (window, document) {

	define([
		'underscore'
		, 'backbone'
		, 'view.board.2d'
		, 'view.board.dom'
	], function (_, Backbone, Board2dView, BoardDomView) {
		'use strict';

		// return BoardDomView;
		return Board2dView;
	});

})(window, document);
