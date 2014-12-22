define([
	'underscore'
	, 'randomcolor'
	, '../tools/tools.random'
], function (_, randomColor, Random) {
	var Color = {};

	Color.random = function (options) {
		if (!options) {
			options = {};
		}

		if (!options.excluded) {
			options.excluded = [];
		}

		if (!options.luminosity) {
			options.luminosity = 'dark';
		}

		var color = randomColor(options);

		return options.excluded.indexOf(color) === -1 ? color : this.random(options);
	};

	Color.componentToHex = function (c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	};

	Color.rgbToHex = function (r, g, b) {
		return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
	};

	Color.hexToRgb = function (hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	};

	return Color;
});
