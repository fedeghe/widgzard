$NS$.url = (function () {

	var _hash = [],
		_urlHash = {
			get : function () {
				return document.location.hash;
			},
			set : function () {
				_hash = [].slice.call(arguments, 0);
				document.location.hash = '#/' + _hash.join('/');
			}
		};

	function getHash() {
		var h = _urlHash.get().replace(/^\#\/?/, '');
		if (h.length)
			return _hash = h.split(/\//);
		return false;
	}

	function setHash() {
		var arg = [].slice.call(arguments, 0).filter(function (el) {return el.length;});
		_urlHash.set.apply(null, arg);
	}

	return {
		hash : _hash,
		getHash : getHash,
		setHash : setHash
	}
}());