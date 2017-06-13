$NS$.lstorage = (function () {

	var ls = window.localStorage;

	function set (key, value) {
		ls.setItem(key, JSON.stringify(value));
	}
	function get (key) {
		var item = ls.getItem(key);
		if (!item) return null;
		return JSON.parse(item);
	}
	return {
		set : set,
		get : get
	};
})();