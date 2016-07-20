/*
[MALTA] ../core.js
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


    var debugActive = false;

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
        ctx = (ctx !== undefined) ? ctx : W;

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


    // use makens to publish itself and something more
    //
    makens(ns, {

        makeNS : makens,
        checkNS : checkns,

        debug : function (f) {
            debugActive = !!f;
        },

        dbg : function (m) {
            // maybe shut up
            if (!debugActive) {return void 0;}
            try {console.log(m);} catch(e1) {try {opera.postError(m);} catch(e2){alert(m);}}
        }
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
})('FG');



/*
[MALTA] ../util.js
*/
FG.util = {
	uniqueid: new function () {
        var count = 0,
            self = this;
        this.prefix = 'FG';
        this.toString = function () {
            ++count;
            return  self.prefix + count;
        };
	},
	isValidEmail: function (email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	},
    delegate: function (func, ctx) {
        // get relevant arguments
        // 
        var args = Array.prototype.slice.call(arguments, 2);
        
        // return the function with wired context
        // 
        return function () {
            return func.apply(
                ctx || null,
                [].concat(args, Array.prototype.slice.call(arguments, 0))
            );
        };
    }
};
/*
[MALTA] ../object.js
*/
FG.object = (function (){

    /**
     * maps an object literal to a string according using the map function  passed
     * @param  {Literal}   o  the object literal
     * @param  {Function} fn  the map function
     * @return {String}       the resulting string
     */
    function map(o, fn) {
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

        if(!what.match(/key|value/)) {
            throw new Error('Bad param for object.digFor');
        }
        limit = ~~limit;
        
        var found = 0,
            matches = {
                key : function (k1, k2, key) {
                    return (FG.object.isString(k1) && key instanceof RegExp) ?
                        k1.match(key)
                        :
                        jCompare(k1, key);
                },
                value : function (k1, k2, val) {
                    
                    var v =  (FG.object.isString(k2) && val instanceof RegExp) ?
                        k2.match(val)
                        :
                        jCompare(k2, val);
                    
                    return v;
                }
            }[what],
            res = [],
            maybeDoPush = function (path, index, key, obj, level) {

                var p = [].concat.call(path, [index]),
                    tmp = matches(index, obj[index], key);

                if (tmp) {
                    res.push({
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


    return {
        /**
         * uses map private function to map an onject literal to a querystring ready for url
         * @param  {Literal} obj    the object literal
         * @return {String}         the mapped object
         */
        toQs : function (obj) {
            return map(obj, function (o, i, r) {
                return ((r ? '&' : '?') + encodeURIComponent(i) + '=' + encodeURIComponent(o[i])).replace(/\'/g, '%27');
            });
        },

        jCompare: jCompare,
        
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


        isString : function(o) {
            return typeof o === 'string' || o instanceof String;
        },

        extend: function(o, ext, force) {
            var obj = FG.object.clone(o),
                j;
            for (j in ext) {
                if (ext.hasOwnProperty(j) && (!(j in obj) || force)) {
                    obj[j] = ext[j];
                }
            }
            return obj;
        },

        clone: function(obj) {
            var self = FG.object,
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
        }
    };
})();
/*
[MALTA] ../io.js
*/
FG.makeNS('FG/io');
FG.io = (function (){

    var W = window,
        _ = {
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
        },
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
            data = FG.object.toQs(data).substr(1);
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
        }
    };


    // return module
    return {
        getxhr : _.getxhr,
        post : function (uri, cback, async, data, cache, err) {
            return _.ajcall(uri, {
                cback : cback,
                method : 'POST',
                async : !!async,
                data : data,
                cache : cache,
                error: err
            });
        },
        get : function (uri, cback, async, data, cache, err) {
            return _.ajcall(uri, {
                cback : cback || function () {},
                method : 'GET',
                async : !!async,
                data : data,
                cache : cache,
                error : err
            });
        },
        getJson : function (uri, cback, data) {
            return _.ajcall(uri, {
                type : 'json',
                method: 'GET',
                cback : function (r) {
                    cback( (W.JSON && W.JSON.parse) ? JSON.parse(r) : eval('(' + r + ')') );
                },
                data : data
            });
        },
        getXML : function (uri, cback) {
            return _.ajcall(uri, {
                method : 'GET',
                type : 'xml',
                cback : cback || function () {}
            });
        }
    };
})();
//-----------------------------------------------------------------------------
/*
[MALTA] ../css.js
*/
FG.makeNS('FG/css');

FG.css.style = function (el, prop, val ) {

    var prop_is_obj = (typeof prop === 'object' && typeof val === 'undefined'),
        ret = false,
        newval, k;

    if (!prop_is_obj && typeof val === 'undefined') {

        ret = el.currentStyle ? el.currentStyle[prop] : el.style[prop];
        return ret;
    }

    if (prop_is_obj) {
        for (k in prop) {
            el.style[k] = prop[k];
        }
    } else if (typeof val !== 'undefined') {
        val += '';

        el.style[prop] = val;

        if (prop === 'opacity') {
            el.style.filter = 'alpha(opacity = ' + (~~(100 * parseFloat(val, 10))) + ')';
        }
        
    }
};
/*
[MALTA] ../dom.js
*/
FG.dom = {

	addClass : function (elem, addingClass) {
	    var cls = !!(elem.className) ? elem.className : '',
	    	reg = new RegExp('(\\s|^)' + addingClass + '(\\s|$)');
	    if (!cls.match(reg)) {
	        elem.className = addingClass + ' '+ cls;
	    }
	},

	removeClass : function (elem, removingClass) {
		var reg = new RegExp('(\\s|^)' + removingClass + '(\\s|$)');
	    elem.className = elem.className.replace(reg, ' ');
	},

	descendant : function () {
        var args = Array.prototype.slice.call(arguments, 0),
            i = 0,
            res = args.shift(),
            l = args.length;
        if (!l) return res;
        while (i < l) {
            res = res.children.item(~~args[i++]);
        }
        return res;
    },
    remove : function (el) {
    	var parent = el.parentNode;
        parent.removeChild(el);
    }
};
/*
[MALTA] ../events.js
*/
FG.makeNS('FG/events');

FG.events.on = (function(W) {
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

FG.events.eventTarget = function(e) {
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

FG.events.kill = function(e) {
    if (!e) {
        e = W.event;
        e.cancelBubble = true;
        e.returnValue = false;
    }
    'stopPropagation' in e && e.stopPropagation() && e.preventDefault();
    return false;
};

FG.events.ready = (function () {
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

/* From Modernizr */
FG.events.transitionEnd = (function () {
    var n = document.createElement('fake'),
        k,
        trans = {
          'transition':'transitionend',
          'OTransition':'oTransitionEnd',
          'MozTransition':'transitionend',
          'WebkitTransition':'webkitTransitionEnd'
        };
    for(k in trans){
        if (n.style[k] !== undefined ){
            return trans[k];
        }
    }
})();
/*
[MALTA] ../channel.js
*/
/**
 * [Channel description]
 * @param {[type]} n [description]
 */
FG.Channel = (function () {
    var channels = {},

        // function added to free completely
        // that object from dependencies
        // 
        findInArray = function (arr, mvar) {
            //IE6,7,8 would fail here
            if ('indexOf' in arr) {
                return arr.indexOf(mvar);
            }
            var l = arr.length - 1;
            while (arr[l] !== mvar) {
                l--;
            }
            return l;
        },

        _Channel = function () {
            this.topic2cbs = {};
            this.enabled = true;
        };

    /**
     * [prototype description]
     * @type {Object}
     */
    _Channel.prototype = {
        /**
         * enable cb execution on publish
         * @return {undefined}
         */
        enable : function () {
            this.enabled = true;
        },

        /**
         * disable cb execution on publish
         * @return {undefined}
         */
        disable : function () {
            this.enabled = false;
        },

        /**
         * publish an event on that channel
         * @param  {String} topic
         *                  the topic that must be published
         * @param  {Array} args
         *                 array of arguments that will be passed
         *                 to every callback
         * @return {undefined}
         */
        pub : function (topic, args) {
            var i = 0,
                l;
            if (!(topic in this.topic2cbs) || !this.enabled) {
                return false;
            }
            for (l = this.topic2cbs[topic].length; i < l; i += 1) {
                this.topic2cbs[topic][i].apply(null, [topic].concat(args));
            }
            return true;
        },

        /**
         * add a callback to a topic
         * @param {String} topic
         *                 the topic that must be published
         * @param {Function} cb
         *                   the callback will receive as first
         *                   argument the topic, the others follow
         * @return {undefined}
         */
        sub : function (topic, cb, force) {
            var i = 0,
                l;
            if (topic instanceof Array) {
                for (l = topic.length; i < l; i += 1) {
                    this.sub(topic[i], cb);
                }
            }

            if (!(topic in this.topic2cbs) || !this.enabled) {
                this.topic2cbs[topic] = [];
            }

            if (!force && findInArray(this.topic2cbs[topic], cb) >= 0) {
                return this;
            }

            this.topic2cbs[topic].push(cb);
        },

        /**
         * removes an existing booked callback from the topic list
         * @param  {[type]}   topic [description]
         * @param  {Function} cb    [description]
         * @return {[type]}         [description]
         */
        unsub : function (topic, cb) {
            var i = 0,
                l;
            if (topic instanceof Array) {
                for (l = topic.length; i < l; i += 1) {
                    this.unsub(topic[i], cb);
                }
            }
            if (topic in this.topic2cbs) {
                i = findInArray(this.topic2cbs[topic], cb);
                if (i >= 0) {
                    this.topic2cbs[topic].splice(i, 1);
                }
            }
            return this;
        },
        
        /**
         * one shot sub with auto unsub after first shot
         * @param  {[type]}   topic [description]
         * @param  {Function} cb    [description]
         * @return {[type]}         [description]
         */
        once : function (topic, cb){
            var self = this,
                cb2 = function () {
                    cb.apply(null, Array.prototype.slice.call(arguments, 0));
                    self.unsub(topic, cb2);
                };
            this.sub(topic, cb2);
        },

        /**
         * Removes all callbacks for one or more topic
         * @param [String] ...
         *                 the topic queues that must  be emptied
         * @return [Channel] the instance
         */
        reset : function () {
            var ts = Array.prototype.slice.call(arguments, 0),
                l = ts.length,
                i = 0;
            if (!l) {
                this.topic2cbs = {};
                return this;
            }
            for (null; i < l; i += 1) {
                ts[i] in this.topic2cbs && (this.topic2cbs[ts[i]] = []);
            }
            return this;
        }
    };

    /**
     * returning function
     */
    return function (name) {
        /*
        if (!(name in channels)) {
            channels[name] = new _Channel();
        }
        return channels[name];
        */
        return name in channels ? channels[name] : (channels[name] = new _Channel());
    };
})();
/*
[MALTA] ../i18n.js
*/
FG.makeNS('FG/i18n', function () {
	var data = {};

	FG.lang = typeof sm_lang !== 'undefined' ? sm_lang : 'en';

	return  {

		load : function (dict) {
			data = dict;
		},

		parse : function (obj) {
			var self = this,
				replacing = FG.object.digForValue(obj, /i18n\(([^}|]*)?\|?([^}]*)\)/);
			
			for (i = 0, l = replacing.length; i < l; i++) {
				mayP = FG.i18n.check(replacing[i].regexp[0]);
				if (mayP) {
					ref = FG.checkNS(replacing[i].container, obj);	
					// ref[replacing[i].key] = mayP;
					ref[replacing[i].key] = FG.i18n.get(mayP[1], mayP[2]);
				} 
			}
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
				FG.lang in lo[_label] && (data[_label] = lo[_label][FG.lang]);
			}
		},
		
		check : function (lab) {
			// return lab.match(/i18n\(([^)|]*)?\|?([^)|]*)\|?([^)]*)?\)/); 3???
			return lab.match(/i18n\(([^}|]*)?\|?([^}]*)\)/);
		},
		
		get : function (k, fallback) {
			
			var maybe = FG.checkNS(k, data);
			// return data[k] || fallback || 'no Value';
			return maybe || fallback || 'no Value';
			// return maybe || fallback || false;
		}
	}
});
