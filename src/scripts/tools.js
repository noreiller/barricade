define([
	'underscore'
	, 'tools.color'
	, 'tools.random'
	, 'tools.lorem'
	, 'game.user'
], function (_, Color, Random, Lorem, User) {
	var Tools = {
		color: Color
		, random: Random
		, lorem: Lorem
	};

	/**
	 * Retrieve a translation
	 */
	Tools.getI18n = function () {
		var dict = User.storage.get('dict');
		var s = dict[arguments[0]] || arguments[0];

		arguments[0] = s;

		s = Tools.printf.apply(Tools, arguments);

		return s;
	};

	Tools.printf = function () {
		var input = arguments[0];
		var args = arguments[1];

		if (!args) {
			return input;
		}

		var searchDigitRegex = /%(\d+)/g;
		var searchKeyRegex = /%(\w+)/g;

		// Search first for digits ($0, $1...)
		var matches = searchDigitRegex.exec(input);

		while (matches) {
			var ind = Number(matches[1]);

			if (arguments[ind + 2]) {
				input = input.replace(matches[0], arguments[ind + 2]);
			}
			else {
				input = input.replace(matches[0], '?');
			}

			matches = searchDigitRegex.exec(input);
		}

		// Search first for property ($name, $id...)
		matches = searchKeyRegex.exec(input);

		while (matches) {
			if (args[matches[1]]) {
				input = input.replace(matches[0], args[matches[1]]);
			}
			else {
				input = input.replace(matches[0], '?');
			}

			matches = searchKeyRegex.exec(input);
		}

		return input;
	};

	Tools.getJSON = function (url, callback) {
		var r = new XMLHttpRequest();

		r.open("get", url, true);

		r.onreadystatechange = function () {
			if (r.readyState == 4) {
				if (r.status == 200) {
					return callback(null, JSON.parse(r.responseText));
				}
				else {
					return callback(new Error('Cannot reach file "' + url + '".'));
				}
			}
		};

		r.send();
	};

	Tools.indexOfObject = function (arrays, array, join) {
		if (!join) {
			join = ',';
		}

		return _.map(arrays, function (a) {
			return a.join(join);
		}).indexOf(array.join(join));
	};

	Tools.indexesOfObject = function (arrays, array, join) {
		if (array.length) {
			if (!join) {
				join = ',';
			}

			return Tools.indexesOf(_.map(arrays, function (a) {
				return a.join(join);
			}), array.join(join));
		}
		else {
			return Tools.indexesOf(_.map(arrays, function (a) {
				return JSON.stringify(a);
			}), JSON.stringify(array));
		}
	};

	/**
	 * Get indexes of a search in array
	 * @param  {object} array   The array to search in
	 * @param  {mixed} element  The searched value
	 * @return {object}         The array with all the result search
	 */
	Tools.indexesOf = function (array, element) {
		var
			indices = []
			, idx = array.indexOf(element)
		;

		while (idx != -1) {
			indices.push(idx);
			idx = array.indexOf(element, idx + 1);
		}

		return indices;
	};

	return Tools;
});
