$ns$.makeNS('$ns$/engy2');
$ns$.engy2 = (function () {


	var components = {};

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


	return {

		config : {
		    componentsUrl : '$componentsUrl$',
		    lazyLoading : $lazyLoading$
		},

		process : function () {
			var config = [].slice.call(arguments, 0)[0],
				endPromise = $ns$.Widgzard.Promise.create(),
				Processor, proto;
				engy = this;;

			Processor = function (config) {
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
								
								var componentName = engy.config.componentsUrl + tmp[j].value + '.js',
									cached = componentName in components;

								function cback(r) {

									// maybe is not already cached
									//
									if (!cached) {
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

								/**
								 * maybe is cached
								 */
								cached ?
									cback (components[componentName])
									:
									$ns$.io.get(componentName, cback, true);	
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
		},

		render : function (params, clean) {
			var t = +new Date,
				pRet = $ns$.Widgzard.Promise.create();
			$ns$.engy2.process( params ).then(function(p, r) {
			    var r = $ns$.Widgzard.render(r[0], clean);
			    console.log('t: ' + (+new Date - t));
			    pRet.done(r);
			});
			return pRet;
		}
	};
})();
