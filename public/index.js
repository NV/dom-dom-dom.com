// Just for testing. This will go to the server.

window._obj = uncircularOwnProperties(window);

window.onload = function index() {
	var uncircled = uncircularOwnProperties(window._obj);
	console.log(uncircled);
	var fragment = inspect(uncircled, 3, []);

	var pre = document.createElement('pre');
	pre.appendChild(fragment);
	document.body.appendChild(pre);
};

document.documentElement.addEventListener('click', function(e) {
	var target = e.target;
	if (target.tagName !== 'A') {
		return;
	}
	var keys = target.hash.slice(1).split('.');

	var element = get(keys);

	target.parentNode.insertBefore(element, target);
	target.remove();
	e.preventDefault();
}, false);

function get(keys) {
	var obj = window._obj;
	for (var i = 0; i < keys.length; i++) {
		obj = obj[keys[i]];
	}
	return inspect(obj, 1, keys);
}
