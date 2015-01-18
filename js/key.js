(function () {
	var base = 'http://www.widgzard.dev/',
		styles = ['../css/reset.css', 'css/base.css', 'css/engy.min.css'],
		scripts = ['../js/lib.js', '../js/engy.js', '../js/engyScript.js'],
		i = 0, l = styles.length;
	for (var tmp ;i < l; i++) {
		tmp = document.createElement('link');
		tmp.href = styles[i];
		tmp.rel = 'stylesheet';
		document.head.appendChild(tmp);
		console.debug(document.head.innerHTML);
	}
	for (i = 0, l = scripts.length ;i < l; i++) {
		tmp = document.createElement('script');
		tmp.src = scripts[i];
		document.body.appendChild(tmp);
	}
})();