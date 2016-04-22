FG.makeNS('FG/engy2');
FG.engy2.config = {
    componentsUrl : '/engy/components/'
};
/*
[MALTA] ../engy/engy2.js
*/
FG.makeNS('FG/engy2');
FG.engy2.config = {
    componentsUrl : '/engy/components/',
    lazyLoading : true
};

FG.engy2.process = function () {

	var config = [].slice.call(arguments, 0)[0],
		endPromise = FG.Promise.create(),
		Processor, proto;
		engy = this;

	function _overwrite(ns, path, o) {
		var pathEls = path.split(/\.|\//),
			i = 0, l = pathEls.length;

		if (l > 1) {
			for (null; i < l-1; i++) ns = ns[pathEls[i]];
		}

		ns[pathEls[l-1]] = o;
	}

	function _mergeComponent(ns, path, o) {

		var componentPH = FG.checkNS(path, ns),
			replacementOBJ = o,
			merged = {}, i,
			pathEls = path.split(/\.|\//),
			i = 0, l = pathEls.length;

		// start from the replacement
		// 
		for (i in replacementOBJ)
			merged[i] = replacementOBJ[i];

		// copy everything but 'component' & 'params', overriding
		// 
		for (i in componentPH) {
			!(i.match(/component|params/))
			&&
			(merged[i] = componentPH[i]);
		}
		
		_overwrite(ns, path, merged);
	}

	Processor = function (config) {
		this.components = [];
		this.retFuncs = [];
		this.config = config;
	};
	proto = Processor.prototype;

	proto.run = function () {
		var self = this,
			tmp = FG.object.digForKey(self.config, 'component'),
			i, l,
			myChain = []; 

		if (tmp.length) {
			for (i in tmp) {
				(function (j) {
					myChain.push(function (p) {
						
						FG.io.get(
							// File
							// 
							engy.config.componentsUrl + tmp[j].value + '.js',

							// callback
							// 
							function (r) {
								var o = eval('(' + r.replace(/\/n|\/r/g, '') + ')'),
									params = FG.checkNS(tmp[j].container + '/params', self.config),
									usedParams, k, l, v, t;

								if (params) {

									// check if into the component are used var placeholders
									// 
									usedParams = FG.object.digForValue(o, /#PARAM{([^}|]*)?\|?([^}]*)}/);

									l = usedParams.length;
									if (l) {
										for (k = 0; k < l; k++) {
											
											t = usedParams[k].regexp[1] in params ?
												params[usedParams[k].regexp[1]]
												:
												(usedParams[k].regexp[2] || "");

											v = FG.checkNS(usedParams[k].path, o)
												.replace(usedParams[k].regexp[0],  t);

											_overwrite(o, usedParams[k].path, v);
										}
									}
								}
								_mergeComponent(self.config, tmp[j].container, o);

								// file got, solve the promise
								// 
								p.done();
							},
							true
						);
					});
				})(i);
			}

			// solve & recur
			//
			FG.Promise.chain(myChain).then(function (p, r) {
				self.run();
			});

		// in that case everything is done since
		// we have no more components in the object
		// 
		} else {
			endPromise.done(self.config);
		}
	};

	(new Processor(config)).run();

	return endPromise;
};

FG.engy2.render = function (params, clean) {
	var t = +new Date;
	FG.engy2.process( params ).then(function(p, r) {
	    FG.Widgzard.render(r[0], clean);
	    console.log('t2: ' + (+new Date - t));
	});
}