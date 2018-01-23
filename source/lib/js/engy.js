/**


	      ..      .                                            
	   x88f` `..x88. .>                             ..         
	 :8888   xf`*8888%     u.    u.                @L          
	:8888f .888  `"`     x@88k u@88c.      uL     9888i   .dL  
	88888' X8888. >"8x  ^"8888""8888"  .ue888Nc.. `Y888k:*888. 
	88888  ?88888< 888>   8888  888R  d88E`"888E`   888E  888I 
	88888   "88888 "8%    8888  888R  888E  888E    888E  888I 
	88888 '  `8888>       8888  888R  888E  888E    888E  888I 
	`8888> %  X88!        8888  888R  888E  888E    888E  888I 
	 `888X  `~""`   :    "*88*" 8888" 888& .888E   x888N><888' 
	   "88k.      .~       ""   'Y"   *888" 888&    "88"  888  
	     `""*==~~`                     `"   "888E         88F  
	                                  .dWi   `88E        98"   
	                                  4888~  J8%       ./"     
	                                   ^"===*"`       ~`  v.0.3 the razor
  

	@author Federico Ghedina <fedeghe@gmail.com>
	@date 22-04-2016
	@version 0.3

*/
+function () {

	console.log("\n\n ENGY v.$VERSION.ENGY$\n\n");

	// local cache for components
	// 
	var components = {},
		preloadedComponents = {},
		config = {
			fileNameSeparator: 	"/",
			fileNamePrepend: 	"$COMPONENTS.NAME_PREPEND$",
			ext: 				"$COMPONENTS.EXT$",
			componentsUrl: 		"$COMPONENTS.URL$"
		},
		num = 0;

	function _configSet(cnf) {
		var j;
		for (j in config) {
			if (j in cnf){
				config[j] = cnf[j];
			}
		}
		return this;
	}

	/**
	 * [_overwrite description]
	 * @param  {object} ns   the namespace of destination
	 * @param  {string} path the target path into the namespace
	 * @param  {object} o    the object to be inserted
	 * @return {void}      	 [description]
	 */
	function _overwrite(destObj, path, obj) {

		// path can be
		// str1
		// str1/str2[/str3[...]] (or str1.str2[.str3])
		// 
		// in any case we need the elements of it 
		//
		var pathEls = path.split(/\.|\//),
			l = pathEls.length,
			i = 0;

		// in case path has more than one element in the split result
		// like
		// aaa/bbb/ccc/ddd
		// dig destObj to destObj.aaa.bbb.ccc
		//
		while (i < l-1) destObj = destObj[pathEls[i++]];

		// now the object is inserted
		//
		destObj[pathEls[l-1]] = obj;
	}

	/**
	 * [_mergeComponent description]
	 * @param  {[type]} ns   [description]
	 * @param  {[type]} path [description]
	 * @param  {[type]} o    [description]
	 * @return {[type]}      [description]
	 */
	function _mergeComponent(ns, path, o) {
		
		var componentPH = NS.checkNs(path, ns),
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
		for (i in componentPH)
			!(i.match(/component|params/)) && (merged[i] = componentPH[i]);

		_overwrite(ns, path, merged);
	}

	function Processor(config) {
		this.config = config;
		this.endPromise = NS.Promise.create();
	}

	/**
	 * [getFileName description]
	 * @param  {[type]} n [description]
	 * @return {[type]}   [description]
	 */
	Processor.prototype.getFileName = function (n) {
		var els = n.split(/\/|\|/),
			res = n,
			l = els.length;
		
		els[l-1] = config.fileNamePrepend + els[l-1];
		res = els.join(config.fileNameSeparator);

		return config.componentsUrl +
			(config.componentsUrl.match(/\/$/) ? '' : '/')  +
			res + config.ext;
	};

	
	/**
	 * [run description]
	 * @return {[type]} [description]
	 */
	Processor.prototype.run = function () {
		var self = this,
			langFunc = NS.i18n.parse,
			elementsN = 0,
			countPromise = NS.Promise.create(),
			solveTime = NS.Promise.create(),
			start = +new Date(), end,
			xhrTot = 0,
			cback;

		(function solve() {
			var component = NS.object.digForKey(self.config, 'component', 1),
				componentName,
				cached, preLoaded,
				innerPromise = NS.Promise.create(),
				xhrStart = 0,
				xhrEnd = 0;

			innerPromise.then(solve);

			if (!component.length) {

				end = +new Date();
				self.endPromise.done(self.config);
				countPromise.done(elementsN);
				solveTime.done(end - start);

			} else {

				elementsN++;
				component = component[0];
				componentName = self.getFileName(component.value);
				cached = componentName in components;
				preLoaded = componentName in preloadedComponents;

				cback = function (cntORobj) {
					xhrEnd = +new Date;
					xhrTot += xhrEnd - xhrStart;
 					var params = NS.checkNs(component.container + '/params', self.config),
						obj,
						usedParams, foundParam, foundParamValue, foundParamValueReplaced, i, l;
					if (preLoaded) {
						obj = _clone(cntORobj);
					} else {
						if (!cached) {
							components[componentName] = _clone(cntORobj);
						}
						cntORobj = cntORobj.replace(/^[^{]*/, '').replace(/;?$/, '');
						obj = eval('(' + cntORobj + ')');
					}

					// before merging the object I check for the presence of parameters
					if (params) {
						// check if into the component are used var placeholders
						usedParams = NS.object.digForValue(obj, /#PARAM{([^}|]*)?\|?([^}]*)}/);
						l = usedParams.length;

						if (l) {
							for (i = 0; i < l; i++) {
								// check if the label of the placeholder is in the params
								foundParam = NS.checkNs(usedParams[i].regexp[1], params);
								// in case use it otherwise, the fallback otherwise cleanup
								foundParamValue = typeof foundParam !== 'undefined' ? foundParam : (usedParams[i].regexp[2] || "");
								// string or an object?
								if ((typeof foundParamValue).match(/string/i)){

									foundParamValueReplaced = NS.checkNs(usedParams[i].path, obj)
										.replace(usedParams[i].regexp[0],  foundParamValue);
									
									_overwrite(obj, usedParams[i].path, foundParamValueReplaced);

								} else {
									_overwrite(obj, usedParams[i].path, foundParamValue);
								}
							}
						}
					}
					if (component.container) {
						_mergeComponent(self.config, component.container, obj);
					} else {
						self.config = obj;
					}
					innerPromise.done();
				};
				xhrStart = +new Date;
				// cached?
				if (preLoaded) {
					cback (preloadedComponents[componentName]);
				} else if (cached) {
					cback (components[componentName]);
				} else {
					NS.io.get(componentName, cback, true);
				}
			}
		})();

		// now i18n, maybe
		//
		langFunc && langFunc(self.config);
		
		countPromise.then(function (pro ,par){
			console.log("Engy used " + par[0] + " component" + (par[0]==1 ? "" : "s"));
		});

		solveTime.then(function (pro ,par){
			console.log("Engy total time: " + par[0] + 'ms');
			console.log("      \"       unfolding : " + (par[0] - xhrTot) + 'ms');
			console.log("      \"       xhr : " + xhrTot + 'ms');
		});

		return self.endPromise;
	};

	function _process(a) {
		return (new Processor(a)).run();
	}

	function _component (name, obj) {
		if (!(name in preloadedComponents)) {
			preloadedComponents[Processor.prototype.getFileName(name)] = obj;
		}
	}

	function _components (cmps) {
		for (var c in cmps) _component(c, cmps[c]);
	}

	function _clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = _clone(obj[attr]);
		}
		return copy;
	}


	NS.makeNs('Engy', {
		component : _component,
		components : _components,
		configSet : _configSet,
		define : _component,
		get  : function (params, clean, name) {
			var pRet = NS.Promise.create();
			_process(params).then(function(p, r) {
			    pRet.done(NS.Widgzard.get(r[0]));
			});
			return pRet;
		},
		load : function (src) {
			return NS.Widgzard.load(src);	
		},
		getElement : function(n) {
			return NS.Widgzard.getElement(n);
		},
		getElements : function () {
			return NS.Widgzard.getElements();
		},
		process : _process,
		render : function (params, clean, name) {
			var self = this,
				t = +new Date,
				pRet = NS.Promise.create();

			_process(params).then(function(p, r) {
			    console.log('t: ' + (+new Date - t));
			    pRet.done(NS.Widgzard.render(r[0], clean, name));
			});
			return pRet;
		}
	});
}();
