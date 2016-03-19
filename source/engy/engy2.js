$ns$.makeNS('$ns$/engy2');
$ns$.engy2.config = {
    componentsUrl : '$componentsUrl$',
    lazyLoading : $lazyLoading$
};

$ns$.engy2.process = function () {

	var config = [].slice.call(arguments, 0)[0],
		endPromise = $ns$.Widgzard.Promise.create(),
		Processor, proto;
		engy = this,
		components = {};

	function _overwrite(ns, path, o) {
		var pathEls = path.split(/\.|\//),
			i = 0, l = pathEls.length;
		if (l > 1) {
			for (null; i < l-1; i++) ns = ns[pathEls[i]];
		}
		ns[pathEls[l-1]] = o;
	}

	function _mergeComponent(ns, path, o) {

		var componentPH = $ns$.checkNS(path, ns),
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
			tmp = $ns$.object.digForKey(self.config, 'component'),
			i, l,
			myChain = []; 

		if (tmp.length) {
			for (i in tmp) {
				(function (j) {
					myChain.push(function (p) {
						
						var store,
							componentName = engy.config.componentsUrl + tmp[j].value + '.js';
						
						function cback(r) {
							if (store) {
								components[componentName] = r;
							}
							var o = eval('(' + r.replace(/\/n|\/r/g, '') + ')'),
								params = $ns$.checkNS(tmp[j].container + '/params', self.config),
								usedParams, k, l, v, t, y;
							if (params) {
								// check if into the component are used var placeholders
								// 
								usedParams = $ns$.object.digForValue(o, /#PARAM{([^}|]*)?\|?([^}]*)}/);
								// debugger;
								l = usedParams.length;
								if (l) {
									for (k = 0; k < l; k++) {
										
										// check if the label of the placeholder is in the
										// params
										y = $ns$.checkNS(usedParams[k].regexp[1], params);
										
										// in case use it otherwise, the fallback otherwise cleanup
										//
										t = y ? y : (usedParams[k].regexp[2] || "");
										
										// string or an object?
										//
										if ((typeof t).match(/string/i)){
											v = $ns$.checkNS(usedParams[k].path, o)
												.replace(usedParams[k].regexp[0],  t);
											_overwrite(o, usedParams[k].path, v);
										} else {
											_overwrite(o, usedParams[k].path, t);
										}
									}
								}
							}
							_mergeComponent(self.config, tmp[j].container, o);

							// file got, solve the promise
							// 
							p.done();
						}

						if (componentName in components) {
							store = false;
							cback (components[componentName]);
						} else {
							store = true;
							$ns$.io.get(componentName, cback, true);	
						}


						
					});
				})(i);
			}

			// solve & recur
			//
			$ns$.Widgzard.Promise.chain(myChain).then(function (p, r) {
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

$ns$.engy2.render = function (params, clean) {
	var t = +new Date;
	$ns$.engy2.process( params ).then(function(p, r) {
	    $ns$.Widgzard.render(r[0], clean);
	    console.log('t: ' + (+new Date - t));
	});
}