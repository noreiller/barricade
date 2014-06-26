define([
	'underscore'
], function (_) {
	var Random = {};

	Random.bounds = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	return Random;
});
