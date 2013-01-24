/**
 * @param {Object} obj
 * @param {number} depth
 * @param {Array} path
 * @return {String}
 */
function inspect(obj, depth, path) {

	function text(data) {
		return document.createTextNode(data);
	}

	function span(data, className) {
		var element = document.createElement('span');
		if (className) {
			element.className = className;
		}
		element.textContent = data;
		return element;
	}

	/**
	 * @param {DocumentFragment|Element} accumulator
	 * @param {object} obj
	 * @see http://jsperf.com/continuation-passing-style/3
	 * @return {string}
	 */
	function _inspect(accumulator, obj, depth, path) {
		switch(typeof obj) {
			case 'object':
				if (!obj) {
					accumulator.appendChild(span('null', 'type-null'));
					break;
				}

				var keys = Object.getOwnPropertyNames(obj).sort();
				var length = keys.length;
				if (length === 0) {
					accumulator.appendChild(span('{}'));
				} else {
					accumulator.appendChild(span('{'));
					accumulator.appendChild(text('\n'));
					var div = document.createElement('div');
					div.className = 'dom-level';
					accumulator.appendChild(div);

					for (var i = 0; i < length; i++) {
						var key = keys[i];
						div.appendChild(text(stringifyObjectKey(key)));
						div.appendChild(span(': '));

						if (depth > 1) {
							div = _inspect(div, obj[key], depth - 1, path.concat(key));
						} else {
							var value = obj[key];
							if (typeof value === 'object' && value !== null) {
								var a = document.createElement('a');
								a.dataset.key = key;
								a.href = '#' + path.concat(key).join('.');
								a.textContent = '{}';
								div.appendChild(a);
							} else {
								div = _inspect(div, value, depth, path);
							}
						}

						if (i < length - 1) {
							div.appendChild(span(','));
							div.appendChild(text('\n'));
						}
					}
					div.appendChild(text('\n'));
					accumulator.appendChild(span('}'));
				}
				break;

			case 'string':
				accumulator.appendChild(span(JSON.stringify(obj), 'type-string'));
				break;

			case 'undefined':
				accumulator.appendChild(span('undefined', 'type-undefined'));
				break;

			case 'number':
				accumulator.appendChild(span(obj, 'type-number'));
				break;

			default:
				accumulator.appendChild(text(String(obj)));
				break;
		}
		return accumulator;
	}

	return _inspect(document.createDocumentFragment(), obj, depth, path);
}

/**
 * @param {string} key
 * @return {string}
 */
function stringifyObjectKey(key) {
	return /^[a-z0-9_$]*$/i.test(key) ?
			key :
			JSON.stringify(key);
}
