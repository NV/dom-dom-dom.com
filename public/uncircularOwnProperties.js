/**
 * Like https://github.com/NV/CSSOM/blob/gh-pages/spec/utils.js but uses Breadth-first search
 * Highly inspired by Benchmark.js' deepClone function.
 * @param {Object} object
 * @return {Object}
 */
function uncircularOwnProperties(object) {
	object.__visited = null;
	var queue = [object];
	var results = [{}];

	var m = 0;

	var unmarked = [];

	for (var i = 0, ii = queue.length; i < ii; i++) {

		if (m > 10000) {
			debugger;
		}
		m++;

		var source = queue[i];
		var target = results[i];

		if (!source) {
			// undefined somehow happens in Firefox
			continue;
		}

		var keys = Object.getOwnPropertyNames(source).sort();

		for (var j = 0, jj = keys.length; j < jj; j++) {

			var key = keys[j];

			if (key === '__visited') {
				continue;
			}

			if (key === 'mimeTypes' || key === 'plugins') {
				// https://bugs.webkit.org/show_bug.cgi?id=27922
				// FIXME: better work around
				continue;
			}

			try {
				var value = source[key];
			} catch (e) {
				console.error(absolutePath(source.__visited), key);
			}


			if (value === null) {
				target[key] = value;
				continue;
			}

			var aType = typeof value;

			if (aType !== 'object' && aType !== 'function') {
				target[key] = value;
				continue;
			}

			if (typeof value.__visited === 'object' || unmarked.indexOf(value) !== -1) {
				target[key] = absolutePath(value.__visited);
			} else {
				try {
					value.__visited = {up: source.__visited, key: key};
					queue.push(value);
				} catch (e) {
					unmarked.push(source);
					console.error(source, key);
				}

				var targetValue = target[key] = {
					$type: Array.isArray(value) ? 'array' : aType
				};
				target[key] = targetValue;

				results.push(targetValue);
				ii++;
			}

		}

	}

	for (j = queue.length; j--;) {
		delete queue[j].__visited;
	}

	return results[0];
}


function absolutePath(head) {
	var current = head;
	var parts = [];
	while (current && current.hasOwnProperty('key')) {
		parts.unshift(current.key);
		current = current.up
	}
	return '/' + parts.join('/');
}
