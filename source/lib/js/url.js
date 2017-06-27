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
	/**
	 * Gets the hash.
	 *
	 * @return     {Array}  The hash elements / separated.
	 */
	function getHash() {
		var h = _urlHash.get().replace(/^\#\/?/, '');
		return _hash = h.split(/\//);
	}

	/**
	 * Sets the hash.
	 *
	 * @param      all the elements comma separated that has to be in the hash
	 */
	function setHash(a) {
		var arg = [].slice.call(arguments, 0).filter(
			function (el) {return el.length;}
		);
		_urlHash.set.apply(null, arg);
	}

	return {
		hash : _hash,
		getHash : getHash,
		setHash : setHash
	};
}());