(function () {
	/*
	[Malta] ../core.js
	*/
	/**
	 * Autoexecuted closure that allows to create namespaces,
	 * the autocall is used to put the function itself in a namespace
	 * 
	 */
	(function (ns){
	    // this is due, to test all implications see
	    // http://www.jmvc.org/test_strict?ga=false
	    // (the ga=false params inhibits google analytics tracking)
	    "use strict";
	
	    /**
	     * Creates a namespace
	     * @param  {String} str     dot or slash separated path for the namespace
	     * @param  {Object literal} [{}]obj optional: the object to be inserted in the ns
	     * @param  {[type]} ctx     [window] the context object where the namespace will be created
	     * @return {[type]}         the brand new ns
	     *
	     * @hint This method is DESTRUCTIVE if the obj param is passed,
	     *       a conservative version is straight-forward
	     * @sample
	     *     makens('FG', {hello: ...});
	     *     makens('FG', {hi: ...}); // now hello exists no more
	     *
	     *     //use
	     *     makens('FG', {hello: ..., hi: })
	     
	     *     // or if in different files
	     *     // file1     
	     *     makens('FG')
	     *     FG.hello = ...
	     *     //
	     *     // file2
	     *     makens('FG')
	     *     FG.hi = ...
	     *     
	     */
	    function makens(str, obj, ctx) {
	        str = str.replace(/^\//, '');
	        var els = str.split(/\.|\//),
	            l = els.length,
	            _u_ = 'undefined',
	            ret;
	
	        // default context window
	        // 
	        (typeof ctx === _u_) && (ctx = window);
	
	        // default object empty
	        // 
	        (typeof obj === _u_) && (obj = {});
	
	        // if function
	        // 
	        (typeof obj === 'function') && (obj = obj());        
	
	        //
	        if (!ctx[els[0]]) {
	            ctx[els[0]] = (l === 1) ? obj : {};
	        }
	        ret = ctx[els[0]];
	        return (l > 1) ? makens(els.slice(1).join('.'), obj, ctx[els[0]]) : ret;
	    }
	
	
	    function checkns(ns, ctx) {
	
	        ns = ns.replace(/^\//, '');
	        var els = ns.split(/\.|\//),
	            i = 0,
	            l = els.length;
	        ctx = (ctx !== undefined) ? ctx : window;
	
	        if (!ns) return ctx;
	
	        for (null; i < l; i += 1) {
	
	            if (typeof ctx[els[i]] !== 'undefined') {
	                ctx = ctx[els[i]];
	            } else {
	                // break it
	                return undefined;
	            }
	        }
	        return ctx;
	    }
	
	    function extendns(ns, objfn) {
	        var i,
	            obj = typeof objfn === 'function' ? objfn() : objfn;
	        for (i in obj) {
	            if (typeof ns[i] == 'undefined') {
	                ns[i] = obj[i];
	            }
	        }
	    }
	
	
	    // use makens to publish itself and something more
	    //
	    makens(ns, {
	        makeNs : makens,
	        checkNs : checkns,
	        extendNs : extendns
	    });
	    
	    // use it again to define a function to get
	    // uniqueid
	    makens(ns + '.utils', {
	        /**
	         * useful to get a unique id string
	         * @return {String} the wanted id
	         */
	        uniqueId : new function () {
	            var count = 0,
	                self = this;
	            this.prefix = ns + '_';
	            this.toString = function () {
	                return  self.prefix + ++count;
	            }
	        }
	    });
	
	// base ns 
	})('EW');
	
	
	
	/*
	[Malta] ../events.js
	*/
	EW.makeNs('EW/events');
	
	(function () {
	
	    var _ = {
	        events : {
	            wwdb_bindings : {},
	            getElementDeterminant : function (el) {
	                var tname = el.tagName;
	                return (tname.match(/input|textarea/i)) ? 'value' : 'innerHTML';
	            }
	        }
	    };
	
	    EW.events.on = (function(W) {
	        var fn;
	
	        if ('addEventListener' in W) {
	            fn = function(el, evnt, cb) {
	                el.addEventListener.apply(el, [evnt, cb, false]);
	            };
	        } else if ('attachEvent' in W) {
	            fn = function(el, evnt, cb) {
	                el.attachEvent.apply(el, ['on' + evnt, cb]);
	            };
	        } else {
	            fn = function() {
	                throw new Error('No straight way to bind an event');
	            };
	        }
	        return fn;
	    })(this);
	
	    EW.events.eventTarget = function(e) {
	        e = e ? e : window.event;
	        var targetElement = e.currentTarget || (typeof e.target !== 'undefined') ? e.target : e.srcElement;
	        if (!targetElement) {
	            return false;
	        }
	        while (targetElement.nodeType === 3 && targetElement.parentNode !== null) {
	            targetElement = targetElement.parentNode;
	        }
	        return targetElement;
	    };
	
	    EW.events.kill = function(e) {
	        if (!e) {
	            e = W.event;
	            e.cancelBubble = true;
	            e.returnValue = false;
	        }
	        'stopPropagation' in e && e.stopPropagation() && e.preventDefault();
	        return false;
	    };
	
	    EW.events.ready = (function () {
	        var cb = [],
	            readyStateCheckInterval = setInterval(function() {
	                if (document.readyState === "complete") {
	                    clearInterval(readyStateCheckInterval);
	                    for (var i = 0, l = cb.length; i < l; i++) {
	                        cb[i].call(this);
	                    }
	                }
	            }, 10);
	        return function (c) {
	            if (document.readyState === "complete") {
	                c.call(this);
	            } else {
	                cb.push(c);
	            }
	        };
	    })();
	
	    /**
	     * my 2 way databinding
	     */
	    EW.events.ww = {
	        on : function (obj, field,  el, debugobj) {
	            var objLock = false,
	                elLock = false,
	                elDet = _.events.getElementDeterminant(el),
	                elOldVal = el[elDet],
	                objOldVal = obj[field],
	                lock = function(m) {
	                    objLock = elLock = !!m;
	                };
	
	            el.wwdbID = "_" + EW.util.uniqueid;
	
	            // obj
	            // when object changes -> element changes
	            // 
	            _.events.wwdb_bindings[el.wwdbID] = window.setInterval(function () {
	                if (objLock) return;
	                lock(true);
	                if (objOldVal != obj[field]) {
	                    elOldVal = obj[field];
	                    objOldVal = elOldVal;
	                    el[elDet] = elOldVal;
	                }
	                lock(false);
	            }, 25);
	            
	            // input
	            //
	            EW.events.on(el, 'keyup', function () {
	                if (elLock) return;
	                lock(true);
	                if (this[elDet] !== obj[field]) {
	                    obj[field] = this[elDet];
	                    elOldVal = this[elDet];
	                    objOldVal = this[elDet];
	                }
	                lock(false);
	            });
	            el[elDet] = objOldVal;
	        },
	        off : function () {
	            var els = [].slice.call(arguments, 0),
	                l = els.length;
	            while (l-- > 0) {
	                EW.events.off(els[l], 'keyup');
	                window.clearInterval(_.events.wwdb_bindings[els[l].wwdbID]);    
	            }
	        }
	    };
	})();
	/*
	[Malta] ../i18n.js
	*/
	EW.makeNs('EW/i18n', function () {
		var data = {};
	
		EW.lang = typeof sm_lang !== 'undefined' ? sm_lang : 'en';
	
		return  {
			check : function (lab) {
				// return lab.match(/i18n\(([^)|]*)?\|?([^)|]*)\|?([^)]*)?\)/); 3???
				return lab.match(/i18n\(([^}|]*)?\|?([^}]*)\)/);
			},
	
			/**
			 * receives a Literal like
			 * {
			 * 	"hello" : {
			 * 		"de" : "hallo",
			 * 		"it" : "ciao",
			 * 		"fr" : "bonjour",
			 * 	 	"en" : "hello"
			 * 	 },
			 * 	 "prova generale" : {
			 * 	 	"de" : "Generalprobe",
			 * 	  	"it" : "prova generale",
			 * 	   	"fr" : "répétition générale",
			 * 	   	"en" : "dress rehearsal"
			 * 	 }
			 * 	}
			 * @return {[type]} [description]
			 */
			dynamicLoad : function (lo, _label) {
				for (_label in lo) {
					EW.lang in lo[_label] && (data[_label] = lo[_label][EW.lang]);
				}
			},
			
			get : function (k, fallback) {
				
				var maybe = EW.checkNs(k, data);
				// return data[k] || fallback || 'no Value';
				return maybe || fallback || 'no Value';
				// return maybe || fallback || false;
			},
	
			load : function (dict) {
				data = dict;
			},
	
			parse : function (obj) {
				var self = this,
					replacing = EW.object.digForValue(obj, /i18n\(([^}|]*)?\|?([^}]*)\)/),
					mayP, ref, i, l;
				
				for (i = 0, l = replacing.length; i < l; i++) {
					
					if ((typeof replacing[i].regexp).match(/boolean/i)) continue;
	
					mayP = EW.i18n.check(replacing[i].regexp[0]);
					
					if (mayP) {
						ref = EW.checkNs(replacing[i].container, obj);	
						// ref[replacing[i].key] = mayP;
						ref[replacing[i].key] = EW.i18n.get(mayP[1], mayP[2]);
					} 
				}
			}
		}
	});
	
	/*
	[Malta] ../io.js
	*/
	EW.makeNs('EW/io');
	EW.io = (function (){
	
	    var W = window,
	        _ = {
	        ajcall : function (uri, options) {
	            var xhr = _.getxhr(),
	                method = (options && options.method) || 'POST',
	                cback = options && options.cback,
	                cb_opened = (options && options.opened) || function () {},
	                cb_loading = (options && options.loading) || function () {},
	                cb_error = (options && options.error) || function () {},
	                cb_abort = (options && options.abort) || function () {},
	                async = options && options.async || true,
	                data = (options && options.data) || false,
	                type = (options && options.type) || 'text/html',
	                cache = (options && options.cache !== undefined) ? options.cache : true,
	                targetType = type === 'xml' ?  'responseXML' : 'responseText',
	                timeout = options && options.timeout || 3000,
	                complete = false,
	                res = false,
	                ret = false,
	                state = false;
	
	            //prepare data, caring of cache
	            if (!cache) {data.C = +new Date; }
	            data = EW.object.toQs(data).substr(1);
	            xhr.onreadystatechange = function () {
	                var tmp;
	                if (state === xhr.readyState) {
	                    return false;
	                }
	                state = xhr.readyState;
	                if (xhr.readyState === 'complete' || (xhr.readyState === 4 && xhr.status === 200)) {
	                    complete = true;
	                    if (cback) {
	                        res = xhr[targetType];
	                        (function () {cback(res); })(res);
	                    }
	                    ret = xhr[targetType];
	                    //IE leak ?????
	                    W.setTimeout(function () {
	                        xhr = null;
	                    }, 50);
	                    return ret;
	                } else if (xhr.readyState === 3) {
	                    //loading data
	                    cb_loading(xhr);
	                } else if (xhr.readyState === 2) {
	                    //headers received
	                    cb_opened(xhr);
	                } else if (xhr.readyState === 1) {
	                    switch (method) {
	                    case 'POST':
	                        try {
	                            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	                            xhr.send(data || true);
	                        } catch (e1) {}
	                        break;
	                    case 'GET':
	                        try {
	                            tmp = {
	                                xml : 'text/xml',
	                                html : 'text/html',
	                                json : 'application/json'
	                            }[type] || 'text/html';
	
	                            xhr.setRequestHeader('Accept', tmp + '; charset=utf-8');
	                            xhr.send(null);
	                        } catch (e2) {}
	                        break;
	                    default :
	                        alert(method);
	                        xhr.send(null);
	                        break;
	                    }
	                }
	                return true;
	            };
	            xhr.onerror = function () {
	                cb_error && cb_error.apply(null, arguments);
	            };
	            xhr.onabort = function () {
	                cb_abort && cb_abort.apply(null, arguments);
	            };
	            //open request
	            xhr.open(method, (method === 'GET') ? (uri + ((data) ? '?' + data: '')) : uri, async);
	            //thread abortion
	            W.setTimeout(function () {
	                if (!complete) {
	                    complete = true;
	                    xhr.abort();
	                }
	            }, timeout);
	            try {
	                return (targetType === 'responseXML') ? xhr[targetType].childNodes[0] : xhr[targetType];
	            } catch (e3) {}
	            return true;
	        },
	
	        /**
	         * Façade for getting the xhr object
	         * @return {object} the xhr
	         */
	        getxhr : function () {
	            var xhr,
	                IEfuckIds = ['Msxml2.XMLHTTP', 'Msxml3.XMLHTTP', 'Microsoft.XMLHTTP'],
	                len = IEfuckIds.length,
	                i = 0;
	            try {
	                xhr = new W.XMLHttpRequest();
	            } catch (e1) {
	                for (null; i < len; i += 1) {
	                    try {
	                        xhr = new W.ActiveXObject(IEfuckIds[i]);
	                    } catch (e2) {continue; }
	                }
	                !xhr && alert('No way to initialize XHR');
	            }
	            return xhr;
	        }
	    };
	
	    // return module
	    return {
	        get : function (uri, cback, async, data, cache, err) {
	            return _.ajcall(uri, {
	                cback : cback || function () {},
	                method : 'GET',
	                async : !!async,
	                data : data,
	                cache : cache,
	                error : err
	            });
	        }
	    };
	})();
	//-----------------------------------------------------------------------------
	/*
	[Malta] ../object.js
	*/
	EW.object = (function (){
	
	    /**
	     * maps an object literal to a string according using the map function  passed
	     * @param  {Literal}   o  the object literal
	     * @param  {Function} fn  the map function
	     * @return {String}       the resulting string
	     */
	    function str_map(o, fn) {
	        var ret = '', j;
	        for (j in o) {
	            o.hasOwnProperty(j) && (ret += fn(o, j, ret));
	        }
	        return ret;
	    }
	
	    // 
	    // 
	    function jCompare(obj1, obj2) {
	        // avoid tags
	        return  !isNode(obj1)
	                && typeof JSON !== 'undefined' ?
	            JSON.stringify(obj1) === JSON.stringify(obj2)
	            :
	            obj1 == obj2;
	    }
	
	    // Returns true if it is a DOM node
	    //
	    function isNode(o){
	        return (
	            typeof Node === "object" ? o instanceof Node : 
	            o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
	        );
	    }
	
	    // Returns true if it is a DOM element
	    // 
	    function isElement(o){
	        return (
	            typeof HTMLElement === "object" ?
	                o instanceof HTMLElement
	                : //DOM2
	                o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
	        );
	    }
	
	    function digFor(what, obj, target, limit) {
	
	        if(!what.match(/key|value|keyvalue/)) {
	            throw new Error('Bad param for object.digFor');
	        }
	        limit = ~~limit;
	        
	        var found = 0,
	            matches = {
	                key : function (k1, k2, key) {
	                    return (EW.object.isString(k1) && key instanceof RegExp) ?
	                        k1.match(key)
	                        :
	                        jCompare(k1, key);
	                },
	                value : function (k1, k2, val) {
	                    
	                    var v =  (EW.object.isString(k2) && val instanceof RegExp) ?
	                        k2.match(val)
	                        :
	                        jCompare(k2, val);
	                    
	                    return v;
	                },
	                keyvalue : function (k1, k2, keyval) {
	                    return (
	                        (EW.object.isString(k1) && keyval.key instanceof RegExp) ?
	                        k1.match(keyval.key)
	                        :
	                        jCompare(k1, keyval.key)
	                    ) && (
	
	                        (EW.object.isString(k2) && keyval.value instanceof RegExp) ?
	                        k2.match(keyval.value)
	                        :
	                        jCompare(k2, keyval.value)
	                    );
	                }
	            }[what],
	            res = [],
	            maybeDoPush = function (path, index, key, obj, level) {
	
	                var p = [].concat.call(path, [index]),
	                    tmp = matches(index, obj[index], key);
	
	                if (tmp) {
	                    res.push({
	                        obj : obj,
	                        value: obj[index],
	                        key : p[p.length - 1],
	                        parentKey : p[p.length - 2],
	                        path : p.join('/'),
	                        container : p.slice(0, p.length - 1).join('/'),
	                        parentContainer : p.slice(0, p.length - 2).join('/'),
	                        regexp : tmp,
	                        level : level
	                    });
	                    found++;
	                }
	                dig(obj[index], key, p, level+1);
	            },
	            dig = function (o, k, path, level) {
	                // if is a domnode must be avoided
	                if (isNode(o) || isElement(o)) return;
	                
	                var i, l, p, tmp;
	                
	                if (o instanceof Array) {                
	                    for (i = 0, l = o.length; i < l; i++) {
	                        maybeDoPush(path, i, k, o, level);
	                        if (limit && limit == found) break;
	                    }
	                } else if (typeof o === 'object') {
	                    for (i in o) {
	                        maybeDoPush(path, i, k, o, level);
	                        if (limit && limit == found) break;
	                    }
	                } else {
	                    return;
	                }
	            };
	        dig(obj, target, [], 0);
	        return res;
	    }
	
	    /**
	     * returning module
	     */
	    return {
	        
	
	        clone: function(obj) {
	            var self = EW.object,
	                copy,
	                i, l;
	            // Handle the 3 simple types, and null or undefined
	            if (null === obj || "object" !== typeof obj) {
	                return obj;
	            }
	
	            // Handle Date
	            if (obj instanceof Date) {
	                copy = new Date();
	                copy.setTime(obj.getTime());
	                return copy;
	            }
	
	            // Handle Array
	            if (obj instanceof Array) {
	                copy = [];
	                for (i = 0, l = obj.length; i < l; i++) {
	                    copy[i] = self.clone(obj[i]);
	                }
	                return copy;
	            }
	
	            // Handle Object
	            if (obj instanceof Object) {
	                copy = {};
	                for (i in obj) {
	                    if (obj.hasOwnProperty(i)) {
	                        copy[i] = self.clone(obj[i]);
	                    }
	                }
	                return copy;
	            }
	            throw new Error("Unable to copy obj! Its type isn't supported.");
	        },
	
	        /**
	         * { function_description }
	         *
	         * @param      {<type>}  o       { parameter_description }
	         * @param      {<type>}  k       { parameter_description }
	         * @param      {<type>}  lim     The limit
	         * @return     {<type>}  { description_of_the_return_value }
	         */
	        digForKey : function (o, k, lim) {
	            return digFor('key', o, k, lim);
	        },
	
	        /**
	         * [digForValues description]
	         * @param  {[type]} o [description]
	         * @param  {[type]} k [description]
	         * @return {[type]}   [description]
	         */
	        digForValue : function (o, k, lim) {
	            return digFor('value', o, k, lim);
	        },
	
	        /**
	         * { function_description }
	         *
	         * @param      {<type>}  o       { parameter_description }
	         * @param      {<type>}  kv      { parameter_description }
	         * @param      {<type>}  lim     The limit
	         * @return     {<type>}  { description_of_the_return_value }
	         */
	        digForKeyValue : function (o, kv, lim) {
	            return digFor('keyvalue', o, kv, lim);
	        },
	
	        extend: function(o, ext, force) {
	            var obj = EW.object.clone(o),
	                j;
	            for (j in ext) {
	                if (ext.hasOwnProperty(j) && (!(j in obj) || force)) {
	                    obj[j] = ext[j];
	                }
	            }
	            return obj;
	        },
	
	        isString : function(o) {
	            return typeof o === 'string' || o instanceof String;
	        },
	
	        jCompare: jCompare,
	        
	        /**
	         * uses str_map private function to map an onject literal to a querystring ready for url
	         * @param  {Literal} obj    the object literal
	         * @return {String}         the mapped object
	         */
	        toQs : function (obj) {
	            return str_map(obj, function (o, i, r) {
	                return ((r ? '&' : '?') + encodeURIComponent(i) + '=' + encodeURIComponent(o[i])).replace(/\'/g, '%27');
	            });
	        }
	    };
	})();
	/*
	[Malta] ../promise.js
	*/
	/**
	 * [Channel description]
	 * @param {[type]} n [description]
	 */
	EW.Promise = (function () {
	
	    // MY WONDERFUL Promise Implementation .... that's shit
	    // 
	    var _Promise = function() {
	            this.cbacks = [];
	            this.solved = false;
	            this.result = null;
	        },
	        proto = _Promise.prototype;
	    /**
	     * [then description]
	     * @param  {[type]} func [description]
	     * @param  {[type]} ctx  [description]
	     * @return {[type]}      [description]
	     */
	    proto.then = function(func, ctx) {
	        var self = this,
	            f = function() {
	                self.solved = false;
	                func.apply(ctx || self, [ctx || self, self.result]);
	            };
	        if (this.solved) {
	            f();
	        } else {
	            this.cbacks.push(f);
	        }
	        return this;
	    };
	
	    /**
	     * [done description]
	     * @return {Function} [description]
	     */
	    proto.done = function() {
	        var r = [].slice.call(arguments, 0);
	        this.result = r;
	        this.solved = true;
	        if (!this.cbacks.length) {
	            return this.result;
	        }
	        this.cbacks.shift()(r);
	    };
	
	    /* returning module
	    */
	    return {
	        create: function() {
	            return new _Promise();
	        }
	    };
	    
	})();
	/*
	[Malta] ../widgzard.js
	*/
	/**
	
			 ...    .     ...         .       ..                                                          ..       
		  .~`"888x.!**h.-``888h.     @88>   dF                                                          dF         
		 dX   `8888   :X   48888>    %8P   '88bu.                       ..                   .u    .   '88bu.      
		'888x  8888  X88.  '8888>     .    '*88888bu        uL        .@88i         u      .d88B :@8c  '*88888bu   
		'88888 8888X:8888:   )?""`  .@88u    ^"*8888N   .ue888Nc..   ""%888>     us888u.  ="8888f8888r   ^"*8888N  
		 `8888>8888 '88888>.88h.   ''888E`  beWE "888L d88E`"888E`     '88%   .@88 "8888"   4888>'88"   beWE "888L 
		   `8" 888f  `8888>X88888.   888E   888E  888E 888E  888E    ..dILr~` 9888  9888    4888> '     888E  888E 
		  -~` '8%"     88" `88888X   888E   888E  888E 888E  888E   '".-%88b  9888  9888    4888>       888E  888E 
		  .H888n.      XHn.  `*88!   888E   888E  888F 888E  888E    @  '888k 9888  9888   .d888L .+    888E  888F 
		 :88888888x..x88888X.  `!    888&  .888N..888  888& .888E   8F   8888 9888  9888   ^"8888*"    .888N..888  
		 f  ^%888888% `*88888nx"     R888"  `"888*""   *888" 888&  '8    8888 "888*""888"     "Y"       `"888*""   
			  `"**"`    `"**""        ""       ""       `"   "888E '8    888F  ^Y"   ^Y'                   ""      
													   .dWi   `88E  %k  <88F                                       
													   4888~  J8%    "+:*%`                                        
														^"===*"` 
	
	
	 * Widgzard module
	 * 
	 * Create an arbitrary dom tree json based allowing for each node to 
	 * specify a callback that will be called only when either
	 *   > the node is appended (in case the node is a leaf)
	 * ||
	 *   > every child has finished (explicitly calling the done function on his context)
	 *
	 * @author Federico Ghedina <fedeghe@gmail.com>
	 *
	 *
	 *
	 * PLEASE read this : http://stackoverflow.com/questions/1915341/whats-wrong-with-adding-properties-to-dom-element-objects
	 */
	
	(function (W){
		console.log("\n\n WIDGZARD v.0.2\n\n")
	
		'use strict';    
	
		// clearer class that should provide right
		// css float clearing
		// ex: TB uses `clearfix`, I don`t
		// 
		var __clearerClassName = 'clearer', 
			__nodeIdentifier = 'wid',
			__autoclean = true,
			__debug = false,
			__promise = EW.Promise,
			__renders = {};
	
		/*
		[Malta] ../wnode.js
		*/
		/**
		 * Main object constructor represeting any node created
		 * @param {[type]} conf the object that has the information about the node
		 *                      that will be created
		 * @param {[type]} trg  the DomNODE where the element will be appended to
		 * @param {[type]} mapcnt an object used to allow the access from any node
		 *                        to every node that has the gindID attribute
		 */
		function Wnode(conf, trg, mapcnt) {
			
			"use strict";
		
			// save a reference to the instance
			// 
			var self = this,
		
				// the tag used for that node can be specified in the conf
				// otherwise will be a div (except for 'clearer') 
				tag = conf.tag || "div";
		
			// save a reference to the target parent for that node
			// by means of the callback promise chain, in fact the 
			// real parent for the node can even be different as 
			// specified in the conf.target value
			// 
			this.target = trg;
		
			// create the node
			// 
			this.node = conf.ns ? document.createElementNS(conf.ns, tag) : document.createElement(tag);
		
			// save a reference to the node configuration
			// will be useful on append to append to conf.target
			// if specified
			//
			this.conf = conf;
		
			// a reference the the root
			//
			this.root = mapcnt.root;
		
			// save a reference to the parent
			// 
			this.parent = trg;
		
			// as said at the beginning every node keeps a reference
			// to a function that allow to get a reference to any
			// node that in his configuration has a `__nodeIdentifier` value
			// specified
			//
			this.map = mapcnt.map;
		
			// function to abort all
			//
			this.abort = mapcnt.abort;
		
			// publish in the node the getNode fucntion that allows for
			// getting any node produced from the same json having a 
			// `__nodeIdentifier` with a valid value
			// 
			this.getNode = mapcnt.getNode;
		
			// get all nodes mapped
			// 
			this.getNodes = mapcnt.getNodes;
		
			// save a reference to a brand new Promise
			// the Promise.node() will be called as far as
			// all the child elements cb have called 
			// this.done OR this.resolve
			// 
			this.WIDGZARD_promise = __promise.create();
		
			// save a reference to the node callback if speficied
			// otherwise create a function that do nothing but
			// freeing the parent promise from waiting
			//
			this.WIDGZARD_cb = conf.cb || function () {
				__debug && console.log('autoresolving  ', self.node);
				// autoresolve
				self.resolve();
			};
		
			// When called Promise.done means that 
			// the parent callback can be called
			// delegating the parent context
			//
			this.WIDGZARD_promise.then(self.WIDGZARD_cb, self);
		
			// how many elements are found in the content field?
			// that counter is fundamental for calling this node
			// callback only when every child callback has done
			// 
			this.WIDGZARD_len = conf.content ? conf.content.length : 0;
		
			// through these two alias from within a callback
			// (where the DOMnode is passed as context)
			// the have to declare that has finished
			// if the count is nulled it means that the promise 
			// is done, thus it`s safe to call its callback
			//
			this.done = this.resolve = this.solve = function () {
			  
				// if all the child has called done/resolve
				// it`s time to honour the node promise,
				// thus call the node callback
				//
				if (--self.target.WIDGZARD_len == 0) {
					if (self.target.WIDGZARD_promise) {
						self.target.WIDGZARD_promise.done();
					} else {
						self.target.WIDGZARD_cb();   
					}
				}
		
			};
			this.lateWid = mapcnt.lateWid;
		}
		
		/**
		 * save a function to climb up n-parent
		 * @param  {[type]} n [description]
		 * @return {[type]}   [description]
		 */
		Wnode.prototype.climb = function (n) {
			n = n || 1;
			var ret = this;
			while (n--) ret = ret.parent;
			return ret;
		};
		
		/**
		 * and one to go down
		 * @return {[type]} [description]
		 */
		Wnode.prototype.descendant = function () {
			var self = this,
				args = Array.prototype.slice.call(arguments, 0),
				i = 0,
				res = self,
				l = args.length;
			if (!l) return res;
			while (i < l) res = res.childrens[~~args[i++]];
			return res;
		};
		
		/**
		 * Set neo attributes
		 * @param {DOMnode} node  the node
		 * @param {Object} attrs  the hash of attributes->values
		 */
		Wnode.prototype.setAttrs = function (node, attrs) {
			// if set, append all attributes (*class)
			// 
			if (typeof attrs !== 'undefined') { 
				for (var j in attrs) {
					if (j !== 'class') {
						if (j !== 'style') {
							node.setAttribute(j, attrs[j]);
						} else {
							this.setStyle(node, attrs.style);
						}
					} else {
						node.className = attrs[j];
					}
				}
			}
			return this;
		};
		
		/**
		 * Set node inline style
		 * @param {DOMnode} node  the node
		 * @param {Object} style  the hash of rules
		 */
		Wnode.prototype.setStyle = function (node, style) {
			// if set, append all styles (*class)
			//
			if (typeof style !== 'undefined') { 
				for (var j in style) {
					node.style[j.replace(/^float$/i, 'cssFloat')] = style[j];
				}
			}
			return this;
		};
		
		/**
		 * Set node data
		 * @param {DOMnode} node  the node
		 * @param {Object} data   the hash of properties to be attached
		 */
		Wnode.prototype.setData = function (el, data) {
			el.data = data || {};
			return this;
		};
		
		/**
		 * [checkInit description]
		 * @param  {[type]} el [description]
		 * @return {[type]}    [description]
		 */
		Wnode.prototype.checkInit = function (el, conf) {
			var keepRunning = true;
			if ('init' in conf && typeof conf.init === 'function') {
				keepRunning = conf.init.call(el);
				!keepRunning && el.abort();
			}
			return this;
		};
		
		/**
		 * [checkInit description]
		 * @param  {[type]} el [description]
		 * @return {[type]}    [description]
		 */
		Wnode.prototype.checkEnd = function (el, conf) {
			'end' in conf &&
			typeof conf.end === 'function' &&
			this.root.endFunctions.push(function () {conf.end.call(el);});
			return this;
		};
		
		/**
		 * add method for the Wnode
		 */
		Wnode.prototype.add = function () {
		
			var conf = this.conf,
				node = this.node,
				tmp, i, j, k;
		
			// set attributes and styles
			// 
			this.setAttrs(node, conf.attrs)
				.setStyle(node, conf.style)
				.setData(this, conf.data)
				.checkInit(this, conf)
				.checkEnd(this, conf);
		
			// if `html` key is found on node conf 
			// inject its value
			//
			if (typeof conf.html !== 'undefined') {
				node.innerHTML = replaceDataInHTML(conf.html, conf.data);
		
				/**
				 * ABSOLUTELY EXPERIMENTAL 2WDB
				 */
				tmp = node.innerHTML.match(/2wdb\((.*)\)/);
				if (tmp) {
					
					i = EW.checkNs(tmp[1], this);
					if (i !== undefined) {
						j = ('this.' + tmp[1]).split('.');
						k = j.pop();
						i = eval(j.join('.'));
						k in i && EW.events.ww.on(i, k, node);
					}
				}
				// 2WDB end
			}
		
			// if `text` is found on node conf
			// it will be appended
			//  
			if (typeof conf.text !== 'undefined') {
				tmp = document.createTextNode("" + conf.text);
				node.appendChild(tmp);
			}
		
			// if the node configuration has a `__nodeIdentifier` key
			// (and a String value), the node can be reached 
			// from all others callback invoking
			// this.getNode(keyValue)
			//
			if (typeof conf[__nodeIdentifier] !== 'undefined') {
				this.map[conf[__nodeIdentifier]] = this;
			}
			
			// if the user specifies a node the is not the target 
			// passed to the constructor we use it as destination node
			// (node that in the constructor the node.target is always
			// the target passed)
			// 
			(conf.target || this.target.node).appendChild(node);
		
			if (!('childrens' in (conf.target || this.target))) {
				(conf.target || this.target).childrens = [];
			}
			(conf.target || this.target).childrens.push(this);
		
			this.WIDGZARD = true;
		
			// if the node configuration do not declares content array
			// then the callback is executed.
			// in the callback the user is asked to explicitly declare
			// that the function has finished the work invoking
			// this.done() OR this.resolve()
			// this is the node itself, those functions are attached
			// 
			(!conf.content || conf.content.length == 0) && this.WIDGZARD_cb.call(this);
		
			// chain
			return this;
		};
	
		function cleanupWnode(trg) {
			var node = trg.node,
				removeNode = function (t) {
					t.parentNode.removeChild(t);
					return true;
				},
				nodesToBeCleaned = [],
				keys = ['WIDGZARD', 'WIDGZARD_cb', 'WIDGZARD_promise', 'WIDGZARD_length', 'parent', 'getNode', 'climb', 'root', 'done', 'resolve', 'data'],
				kL = keys.length,
				i = 0, j = 0, k = 0,
				n = null;
			
			// pick up postorder tree traversal
			eulerWalk(node, function (n) {
				//skip root & text nodes
				n !== node && n.nodeType != 3 && nodesToBeCleaned.push(n) && k++;
			}, 'post');
			
			while (j < k) {
				n = nodesToBeCleaned[j++];
				while (i < kL) n[keys[i++]] = null;
				removeNode(n);
			}
			nodesToBeCleaned = null,
			keys = null;
			return true;
		}
	
		/**
		 * PUBLIC function to render Dom from Json
		 * @param  {Object} params the configuration json that contains all the 
		 *                         information to build the dom :
		 *                         target : where to start the tree
		 *                         content : what to create
		 *                         {cb} : optional end callback
		 *                         {style} : optional styles for the target Node
		 *                         {attrs} : optionsl attributes to be added at the target Node
		 *                         
		 * @param  {boolean} clean whether or not the target node must be emptied before
		 *                         creating the tree inside it.
		 * @return {undefined}
		 */
		function render (params, clean, name) {
	
			var t1 = +new Date(),
				target = {
					node : params.target || document.body,
					endFunctions : [],
					childrens : [],
					reload : function () {
						render(params, true);
					}
				},
				targetFragment = {
					node : document.createDocumentFragment('div')
				},
				active = true,
				originalHTML = target.node.innerHTML + "",
				t2,
				mapcnt;
			
			// debug ? 
			__debug = !!params.debug;
	
			// maybe cleanup previous
			//
			__autoclean && target.WIDGZARD && cleanupWnode(target);
	
			if (!params) {
				throw new Exception('ERROR : Check parameters for render function');
			}
	
			// a literal used to save a reference 
			// to all the elements that need to be 
			// reached afterward calling this.getNode(id)
			// from any callback
			// 
			mapcnt = {
				root : target,
				map : {},
				getNode : function (id) {return mapcnt.map[id] || false;},
				getNodes : function () {return mapcnt.map;},
				abort : function () {
					active = false;
					target.node.innerHTML = originalHTML;
					
					'onAbort' in params &&
					(typeof params.onAbort).match(/function/i) &&
					params.onAbort.call(null, params);
					
					return false;
				},
				lateWid : function (wid) {
					mapcnt.map[wid] = this;
				}
			};
	
			// rape Node prototype funcs
			// to set attributes & styles
			// and check init function 
			// 
			Wnode.prototype
				.setAttrs(target.node, params.attrs)
				.setStyle(target.node, params.style)
				.setData(target, params.data)
				.setData(targetFragment, params.data);
	
			// target.descendant = Wnode.prototype.descendant;
			targetFragment.descendant = Wnode.prototype.descendant;
			
			// maybe clean
			// 
			if (!!clean) target.node.innerHTML = '';
	
			// maybe a raw html is requested before treating content
			// 
			if (typeof params.html !== 'undefined') {
				target.node.innerHTML = replaceDataInHTML(params.html, params.html);
			}
			
			// initialize the root node to respect what is needed
			// by the childs node Promise 
			// 
			// - len : the lenght of the content array
			// - cb : exactly the end callback
			// 
			
			//target.WIDGZARD_len = params.content ? params.content.length : 0;
			targetFragment.WIDGZARD_len = params.content ? params.content.length : 0;
	
			targetFragment.WIDGZARD_cb = target.WIDGZARD_cb = function () {
				active 
				&&
				target.node.appendChild(targetFragment.node)
				&&
				params.cb && params.cb.call(target);
	
				//ending functions
				//
				if (target.endFunctions.length) {
					for (var i = 0, l = target.endFunctions.length; i < l; i++) {
						target.endFunctions[i]();
					}
				}
			};
	
			// flag to enable cleaning
			//
			//targetFragment.WIDGZARD =
			target.WIDGZARD = true;
	
			// allow to use getNode & getNodes from root
			// 
			//targetFragment.getNode =
			target.getNode = mapcnt.getNode;
			//targetFragment.getNodes =
			target.getNodes = mapcnt.getNodes;
			//targetFragment.abort =
			target.abort = mapcnt.abort;
			//targetFragment.map =
			target.map = mapcnt.map;
			//targetFragment.report =
			target.report = function  () {
		        window.JSON && console.log('json size : ' + JSON.stringify(params).length);
		        console.log('html size : ' + target.node.innerHTML.length);
		    };
	
			// what about a init root function?
			// 
			Wnode.prototype.checkInit(targetFragment, params);
			
			// start recursion
			//
			(function recur(cnf, trg){
				if (!active) {
					return false;
				}
				// change the class if the element is simply a "clearer" String
				// 
				if (cnf.content) {
					for (var i = 0, l = cnf.content.length; i < l; i++) {
						if (cnf.content[i] === __clearerClassName) {
							cnf.content[i] = {
								tag : 'br',
								attrs : {'class' : __clearerClassName}
							};
						}
						// in case a ns is specified, use it through all the subtree automatically
						if ('ns' in cnf) cnf.content[i].ns = cnf.ns;
						recur(cnf.content[i], new Wnode(cnf.content[i], trg, mapcnt).add());
					}
				}
			})(params, targetFragment);
	
			// if no content in the root there are no childs
			// thus, let the cb execute
			// 
			if (!('content' in params)) {
				targetFragment.WIDGZARD_cb();
			}
	
			// maybe save the reference
			//
			if (name && !(name in __renders)) __renders[name] = target;
	
			t2 = +new Date();
			
			console.log('Widgzard render time: ' + (t2-t1) + 'ms');
			
			return target;
		}
	
		function replaceDataInHTML(str, data) {
			return str.replace(/\$([A-z]*)\$/g, function (str, $1) {
				var out  = $1.replace(/\$/g, '');
				return (out in data) ? data[out] : $1;
			});
		}
	
		/**
		 * [get description]
		 * @param  {[type]} params [description]
		 * @return {[type]}        [description]
		 */
		function get (params) {
			var r = document.createElement('div');
			params.target = r;
			render(params);
			return r;
		}
	
		function cleanup(trg, msg){
			render({target : trg, content : [{html : msg || ""}]}, true);
		}
		
		function load (src) {
			var s = document.createElement('script');
			document.getElementsByTagName('head')[0].appendChild(s);
			
			// when finished remove the script tag
			// 
			s.onload = function () {
				s.parentNode.removeChild(s);
			};
	
			// 
			s.src = src;
		}
	
		/**
		 * [eulerWalk description]
		 * @param  {[type]} root [description]
		 * @param  {[type]} func [description]
		 * @param  {[type]} mode [description]
		 * @return {[type]}      [description]
		 */
		 function eulerWalk(root, func, mode) {
			mode = {pre : 'pre', post : 'post'}[mode] || 'post';
			var nope = function () {},
				pre = mode === 'pre' ? func : nope,
				post = mode === 'post' ? func : nope;
	
			(function walk(n_, _n) {
				pre(n_);
				_n = n_.firstChild;
				while (_n) {
					walk(_n);
					_n = _n.nextSibling;
				}
				post(n_);
			})(root);
		}
	
		function htmlspecialchars(c) {
	        return '<pre>' +
	            c.replace(/&(?![\w\#]+;)/g, '&amp;')
	            .replace(/</g, '&lt;')
	            .replace(/>/g, '&gt;')
	            .replace(/"/g, '&quot;')
	            .replace(/'/g, '&#039;') +
	        '</pre>';
	    }
	
		// publish module
		// 
		EW.Widgzard = {
			render : render,
			cleanup : cleanup,
			get : get,
			load : load,
			htmlspecialchars : htmlspecialchars,
			getElement : function(n) {
				return n in __renders ? __renders[n] : false;
			},
			getElements : function () {
				return __renders;
			},
			Promise : __promise
		};
	
	})(this);
	/*------------------------*/
	/*
	[Malta] ../store.js
	*/
	{
	    function none(){return {};}
	    
	    function Store(reducer = none, state){
	        this.reducer = reducer;
	        this.state = state || reducer();
	        this.states = [this.state];
	        this.listeners = [];
	    }
	
	    function pushState(instance, newState) {
	        const len = instance.states.length,
	            oldState = instance.states[len - 1];
	        instance.listeners.forEach((sub) => {
	            sub({...oldState}, {...newState});
	        })
	        instance.states[len] = newState;
	    }
	
	    Store.prototype.getState = function () {
	        return this.states[this.states.length - 1];
	    };
	
	    Store.prototype.dispatch = function (a) {
	        if (!('type' in a)) throw new Error('Actions needs a type');
	        const actionType = a.type;
	        delete a.type;
	        var oldState = this.states[this.states.length - 1],
	            newState = {
	                ...this.reducer(oldState, actionType),
	                ...a
	            };
	
	        pushState(this, newState);
	    };
	
	    Store.prototype.subscribe = function (s) {
	        var self = this;
	        this.listeners.push(s);
	        const p = this.listeners.length - 1;
	        
	        return () => {
	            self.listeners = [
	                ...self.listeners.slice(0, p), 
	                ...self.listeners.slice(p + 1)
	            ];
	        }
	    };
	
	    Store.prototype.all = function () {
	        return [...this.states];
	    }
	
	    Store.prototype.back = function (n) {
	        const topIndex = this.states.length - 1,
	            validIndex = topIndex - n,
	            targetIndex = validIndex > -1 ? validIndex : 0,
	            newState = this.states[targetIndex],
	            oldState = this.states[topIndex];
	        pushState(this, newState);
	    }
	
	    EW.getStore = function (reducer, initState) {
	        return new Store(reducer, initState);
	    };
	}
	/*
	[Malta] ../engy.js
	*/
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
	EW.makeNs('Engy', function () {
	
		console.log("\n\n ENGY v.0.3\n\n");
	
		// local cache for components
		// 
		var components = {},
			preloadedComponents = {},
			config = {
				fileNameSeparator: 	"/",
				fileNamePrepend: 	"",
				ext: 				".js",
				componentsUrl: 		"/components/"
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
			
			var componentPH = EW.checkNs(path, ns),
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
			this.endPromise = EW.Promise.create();
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
				langFunc = EW.i18n.parse,
				elementsN = 0,
				countPromise = EW.Promise.create(),
				solveTime = EW.Promise.create(),
				start = +new Date(), end,
				xhrTot = 0,
				cback;
	
			(function solve() {
				var component = EW.object.digForKey(self.config, 'component', 1),
					componentName,
					cached, preLoaded,
					innerPromise = EW.Promise.create(),
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
	 					var params = EW.checkNs(component.container + '/params', self.config),
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
							usedParams = EW.object.digForValue(obj, /#PARAM{([^}|]*)?\|?([^}]*)}/);
							l = usedParams.length;
	
							if (l) {
								for (i = 0; i < l; i++) {
									// check if the label of the placeholder is in the params
									foundParam = EW.checkNs(usedParams[i].regexp[1], params);
									// in case use it otherwise, the fallback otherwise cleanup
									foundParamValue = typeof foundParam !== 'undefined' ? foundParam : (usedParams[i].regexp[2] || "");
									// string or an object?
									if ((typeof foundParamValue).match(/string/i)){
	
										foundParamValueReplaced = EW.checkNs(usedParams[i].path, obj)
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
						EW.io.get(componentName, cback, true);
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
	
	
		return {
			component : _component,
			components : _components,
			configSet : _configSet,
			define : _component,
			get  : function (params, clean, name) {
				var pRet = EW.Promise.create();
				_process(params).then(function(p, r) {
				    pRet.done(EW.Widgzard.get(r[0]));
				});
				return pRet;
			},
			load : function (src) {
				return EW.Widgzard.load(src);	
			},
			getElement : function(n) {
				return EW.Widgzard.getElement(n);
			},
			getElements : function () {
				return EW.Widgzard.getElements();
			},
			process : _process,
			render : function (params, clean, name) {
				var self = this,
					t = +new Date,
					pRet = EW.Promise.create();
	
				_process(params).then(function(p, r) {
				    console.log('t: ' + (+new Date - t));
				    pRet.done(EW.Widgzard.render(r[0], clean, name));
				});
				return pRet;
			}
		};
	}, EW);
	
})();