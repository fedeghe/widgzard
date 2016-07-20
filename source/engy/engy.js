/**

	      ..      .          ...     ...           ....        .                      
	   x88f` `..x88. .>   .=*8888n.."%888:      .x88" `^x~  xH(`      .xnnx.  .xx.    
	 :8888   xf`*8888%   X    ?8888f '8888     X888   x8 ` 8888h    .f``"888X< `888.  
	:8888f .888  `"`     88x. '8888X  8888>   88888  888.  %8888    8L   8888X  8888  
	88888' X8888. >"8x  '8888k 8888X  '"*8h. <8888X X8888   X8?    X88h. `8888  X888k 
	88888  ?88888< 888>  "8888 X888X .xH8    X8888> 488888>"8888x  '8888 '8888  X8888 
	88888   "88888 "8%     `8" X888!:888X    X8888>  888888 '8888L  `*88>'8888  X8888 
	88888 '  `8888>       =~`  X888 X888X    ?8888X   ?8888>'8888X    `! X888~  X8888 
	`8888> %  X88!         :h. X8*` !888X     8888X h  8888 '8888~   -`  X*"    X8888 
	 `888X  `~""`   :     X888xX"   '8888..:   ?888  -:8*"  <888"     xH88hx  . X8888 
	   "88k.      .~    :~`888f     '*888*"     `*88.      :88%     .*"*88888~  X888X 
	     `""*==~~`          ""        `"`          ^"~====""`       `    "8%    X888> 
	                                                                   .x..     888f  
	                                                                  88888    :88f   
	                                                                  "88*"  .x8*~   v.2.0

	@author Federico Ghedina <fedeghe@gmail.com>
	@date 22-04-2016
	@version 2.0


*/
$NS$.makeNS('engy', function () {

	var components = {},
		config = {
			fileNameSeparator : "/",
			fileNamePrepend : "",
			ext : "$COMPONENTS.EXT$",
			componentsUrl : '$COMPONENTS.URL$'
		},
		Engy = {};

		/*
		Engy = {
			config : {
			    componentsUrl : '$COMPONENTS_URL$'
			}
		};
		*/
	

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
		/*
		if (l > 1)
			for (null; i < l-1; i++)
				ns = ns[pathEls[i]];
		*/

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
		
		var componentPH = $NS$.checkNS(path, ns),
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

	function Processor(config) {
		this.config = config;
		this.endPromise = $NS$.Promise.create();
	}

	Processor.prototype.getFileName = function (n) {
		var els = n.split(/\/|\|/),
			res = n,
			l = els.length;
		if (els.length > 1) {
			els[l-1] = config.fileNamePrepend + els[l-1];
		}
		res = els.join(config.fileNameSeparator);
		return config.componentsUrl  + res + config.ext;
	};
	
	Processor.prototype.run = function () {
		var self = this,
			foundComponents = $NS$.object.digForKey(self.config, 'component'),
			langFunc = $NS$.i18n.parse,
			myChain = [],
			l = foundComponents.length,
			i; 
		
		if (l) {

			for (i = 0; i < l; i++) {

				(function (j) {
					myChain.push(function (pro) {
						
						var componentName = self.getFileName(foundComponents[j].value),
							cached = componentName in components;

						function cback(xhrResponseText) {

							var params = $NS$.checkNS(foundComponents[j].container + '/params', self.config),
								obj,
								usedParams, foundParam, foundParamValue, foundParamValueReplaced, i, l;

							// maybe is not already cached
							//
							if (!cached) {
								components[componentName] = xhrResponseText;
							}
							
//							xhrResponseText = xhrResponseText.replace(/\/n|\/r/g, '')
//											.replace(/^[^{]*/, '')
//											.replace(/;?$/, '');

							xhrResponseText = xhrResponseText.replace(/^[^{]*/, '')
											.replace(/;?$/, '');

							obj = eval('(' + xhrResponseText + ')');

							// before merging the object I check for the presence of parameters
							//
							if (params) {

								// check if into the component are used var placeholders
								// 
								usedParams = $NS$.object.digForValue(obj, /#PARAM{([^}|]*)?\|?([^}]*)}/);

								l = usedParams.length;

								if (l) {

									for (i = 0; i < l; i++) {
										
										// check if the label of the placeholder is in the params
										//
										foundParam = $NS$.checkNS(usedParams[i].regexp[1], params);
										
										// in case use it otherwise, the fallback otherwise cleanup
										//
										foundParamValue = foundParam ? foundParam : (usedParams[i].regexp[2] || "");
										
										// string or an object?
										//
										if ((typeof foundParamValue).match(/string/i)){

											foundParamValueReplaced = $NS$.checkNS(usedParams[i].path, obj)
												.replace(usedParams[i].regexp[0],  foundParamValue);
											
											_overwrite(obj, usedParams[i].path, foundParamValueReplaced);
										} else {
											_overwrite(obj, usedParams[i].path, foundParamValue);
										}
									}
								}
							}
							if (foundComponents[j].container) {
								_mergeComponent(self.config, foundComponents[j].container, obj);
							} else {
								self.config = obj;
							}

							// file got, solve the promise
							// 
							pro.done();
						}
						
						// maybe is cached
						//
						cached ?
							cback (components[componentName])
							:
							$NS$.io.get(componentName, cback, true);	
					});
				})(i);
			}

			// now i18n
			//
			langFunc && $NS$.i18n.parse(self.config);

			// solve & recur
			//
			$NS$.Promise.chain(myChain).then(function () {
				self.run();
			});

		// in that case everything is done since
		// we have no more components in the object
		// 
		} else {
			self.endPromise.done(self.config);
		}
		return self.endPromise;
	};

	Engy.process = function (a) {
		return (new Processor(a)).run();
	};

	Engy.render = function (params, clean, name) {
		var t = +new Date,
			pRet = $NS$.Promise.create();

		Engy.process(params).then(function(p, r) {
		    var r = $NS$.Widgzard.render(r[0], clean, name);
		    console.log('t: ' + (+new Date - t));
		    pRet.done(r);
		});
		return pRet;
	};

	return Engy;

}, $NS$);
