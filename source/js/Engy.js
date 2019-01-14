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
    "use strict";
    console.log("\n\n ENGY v.$VERSION.ENGY$\n\n");

    // local cache for components
    // 
    var components = {},
        preloadedComponents = {},
        config = {
            fileNameSeparator: "/",
            fileNamePrepend: "$ENGY.COMPONENTS.NAME_PREPEND$",
            ext: "$ENGY.COMPONENTS.EXT$",
            componentsUrl: "$ENGY.COMPONENTS.URL$"
        },
        num = 0;

    function _configSet(cnf) {
        var j;
        for (j in config) {
            if (j in cnf) {
                config[j] = cnf[j];
            }
        }
        return this;
    }

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
        while (i < l - 1) destObj = destObj[pathEls[i++]];

        // now the object is inserted
        //
        destObj[pathEls[l - 1]] = obj;
    }

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
        this.endPromise = NS.Balle.one();
    }

    Processor.prototype.getFileName = function (n) {
        var els = n.split(/\/|\|/),
            res = n,
            l = els.length;

        els[l - 1] = config.fileNamePrepend + els[l - 1];
        res = els.join(config.fileNameSeparator);

        return config.componentsUrl +
            (config.componentsUrl.match(/\/$/) ? '' : '/') +
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
            countPromise = NS.Balle.one(),
            solveTimePromise = NS.Balle.one(),
            start = +new Date(), end,
            xhrTot = 0,
            requested = {},
            cback,
            computeStats = $ENGY.STATS$,
            stats = {
                time: 0,
                elements: 0,
                requested: {},
                xhrTot: 0
            };
        
        (function solve() {
            var component = NS.object.digForKey(self.config, 'component', 1),
                componentName,
                cached, preLoaded,
                xhrStart = 0,
                xhrEnd = 0;
            
            if (!component.length) {
                end = +new Date();
                stats.time = end - start;
                stats.elements = elementsN;
                stats.requested = requested;
                stats.xhrTot = xhrTot;
                self.endPromise.resolve([self.config, computeStats && stats]);

            } else {
                // elementsN++;
                component = component[0];
                componentName = self.getFileName(component.value);
                if (component.value in requested) {
                    requested[component.value]++;
                } else {
                    requested[component.value] = 1;
                    elementsN++;
                }
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
                    // before merging the object check for the presence of parameters
                    if (params) {
                        // check if into the component are used var placeholders
                        usedParams = NS.object.digForValue(obj, /#PARAM{([^}|]*)?\|?([^}]*)}/);
                        l = usedParams.length;
                        if (l) {
                            for (i = 0; i < l; i++) {
                                // check if the label of the placeholder is in the params
                                foundParam = NS.checkNs(usedParams[i].regexp[1], params);
                                // in case use it otherwise, the fallback otherwise cleanup
                                foundParamValue = typeof foundParam !== _U_ ? foundParam : (usedParams[i].regexp[2] || "");
                                // string or an object?
                                if ((typeof foundParamValue).match(/string/i)) {

                                    foundParamValueReplaced = NS.checkNs(usedParams[i].path, obj)
                                        .replace(usedParams[i].regexp[0], foundParamValue);

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
                    solve();
                };
                xhrStart = +new Date;
                // cached?
                if (preLoaded) {
                    cback(preloadedComponents[componentName]);
                } else if (cached) {
                    cback(components[componentName]);
                } else {
                    NS.io.get(componentName, cback, true);
                }
            }
        })();

        // now i18n, maybe
        //
        langFunc && langFunc(self.config);
        return self.endPromise;
    };

    function _process(a) {
        return (new Processor(a)).run();
    }

    function _component(name, obj) {
        if (!(name in preloadedComponents)) {
            preloadedComponents[Processor.prototype.getFileName(name)] = obj;
        }
    }

    function _components(cmps) {
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
        component: _component,
        components: _components,
        configSet: _configSet,
        define: _component,
        get: function (params, clean, name) {
            return NS.Balle.one(function (res, rej) {
                return _process(params).then(res);
            });
        },
        load: function (src) {
            return NS.Widgzard.load(src);
        },
        getElement: function (n) {
            return NS.Widgzard.getElement(n);
        },
        getElements: function () {
            return NS.Widgzard.getElements();
        },
        process: _process,
        report : function (stats) {
            var j, ln = '------------------------------------';
            console.log(ln);
            console.log("Engy used " + stats.elements + " component" + (stats.elements  == 1 ? "" : "s"));
            console.log("usage: ");
            for (j in stats.requested) {
                console.log('> ' + j + ': ' + stats.requested[j] + ' time' + (stats.requested[j]>1 && 's'))
            }
            console.log('Engy total time: ' + stats.time + 'ms (' + (stats.time - stats.xhrTot) + ' unfolding,  ' + stats.xhrTot + ' xhr)');
            console.log(ln);
        },
        render: function (params, clean, name) {
            var t = +new Date;
            return NS.Balle.one(function (res, rej) {
                _process(params).then(function (r) {
                    r[1] && NS.Engy.report(r[1])
                    var now = +new Date;
                    console.log('Engy process tot: ' + (now - t));
                    res(NS.Widgzard.render(r[0], clean, name))
                })
            });
        }
    });
}();
