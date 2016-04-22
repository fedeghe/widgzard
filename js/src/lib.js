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
        var els = str.split(/\.|\//),
            l = els.length,
            _u_ = 'undefined',
            ret;
        // default context window
        (typeof ctx === _u_) && (ctx = window);

        // default object empty
        (typeof obj === _u_) && (obj = {});

        // if function
        (typeof obj === 'function') && (obj = obj());        

        //
        if (!ctx[els[0]]) {
            ctx[els[0]] = (l === 1) ? obj : {};
        }
        ret = ctx[els[0]];
        return (l > 1) ? makens(els.slice(1).join('.'), obj, ctx[els[0]]) : ret;
    }


    function checkns(ns, ctx) {
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

    function jCompare(obj1, obj2) {
        return typeof JSON !== 'undefined' ? JSON.stringify(obj1) === JSON.stringify(obj2) : obj1 == obj2;
    }

    //Returns true if it is a DOM node
    function isNode(o){
        return (
            typeof Node === "object" ? o instanceof Node : 
            o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
        );
    }

    //Returns true if it is a DOM element    
    function isElement(o){
        return (
            typeof HTMLElement === "object" ?
                o instanceof HTMLElement
                : //DOM2
                o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
        );
    }

    function digFor(what, obj, target) {

        if(!what.match(/key|value/)) {
            throw new Error('Bad param for object.digFor');
        }
        var matches = {
                key : function (k1, k2, key) {
                    return (FG.object.isString(k1) && key instanceof RegExp) ?
                        k1.match(key)
                        :
                        jCompare(k1, key);
                },
                value : function (k1, k2, val) {
                    return (FG.object.isString(k2) && val instanceof RegExp) ?
                        k2.match(val)
                        :
                        jCompare(k2, val);
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
                    }
                } else if (typeof o === 'object') {
                    for (i in o) {
                        maybeDoPush(path, i, k, o, level);
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
        
        digForKey : function (o, k) {
            return digFor('key', o, k);
        },

        /**
         * [digForValues description]
         * @param  {[type]} o [description]
         * @param  {[type]} k [description]
         * @return {[type]}   [description]
         */
        digForValue : function (o, k) {
            return digFor('value', o, k);
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
[MALTA] ../promise.js
*/
/**
 * [Channel description]
 * @param {[type]} n [description]
 */
FG.Promise = (function () {

    // MY WONDERFUL Promise Implementation
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


    /**
     * [chain description]
     * @param  {[type]} funcs [description]
     * @param  {[type]} args  [description]
     * @return {[type]}       [description]
     */
    function chain(funcs, args) {

        var p = new _Promise();
        var first = (function() {

                funcs[0].apply(p, [p].concat([args]));
                return p;
            })(),
            tmp = [first];

        for (var i = 1, l = funcs.length; i < l; i++) {
            tmp.push(tmp[i - 1].then(funcs[i]));
        }
        return p;
    }

    /**
     * [join description]
     * @param  {[type]} pros [description]
     * @param  {[type]} args [description]
     * @return {[type]}      [description]
     */
    function join(pros, args) {
        var endP = new _Promise(),
            res = [],
            stack = [],
            i = 0,
            l = pros.length,
            limit = l,
            solved = function (remainder) {
                !remainder && endP.done.apply(endP, res);
            };

        for (null; i < l; i++) {
            (function (k) {
                stack[k] = new _Promise();

                // inside every join function the context is a Promise, and
                // is possible to return it or not 
                var _p = pros[k].apply(stack[k], [stack[k], args]);
                (_p instanceof _Promise ? _p : stack[k])
                .then(function (p, r) {
                    res[k] = r;
                    solved(--limit);
                });
            })(i);
        }
        return endP;
    }

    /* returning module
    */
    return {
        create: function() {
            return new _Promise();
        },
        chain: chain,
        join: join
    };
    
})();
/*
[MALTA] ../widgzard.js
*/
/**

      _/          _/  _/_/_/  _/_/_/      _/_/_/  _/_/_/_/_/    _/_/    _/_/_/    _/_/_/    
     _/          _/    _/    _/    _/  _/              _/    _/    _/  _/    _/  _/    _/   
    _/    _/    _/    _/    _/    _/  _/  _/_/      _/      _/_/_/_/  _/_/_/    _/    _/    
     _/  _/  _/      _/    _/    _/  _/    _/    _/        _/    _/  _/    _/  _/    _/     
      _/  _/      _/_/_/  _/_/_/      _/_/_/  _/_/_/_/_/  _/    _/  _/    _/  _/_/_/   


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
    
    'use strict';    

    // clearer class that should provide right
    // css float clearing
    // ex: TB uses `clearfix`, I don`t
    // 
    var clearerClassName = 'clearer', 
        nodeIdentifier = 'wid',
        autoclean = true,
        debug = false,
        Wproto = Wnode.prototype,
        Promise = FG.Promise,
        htmlspecialchars, delegate, eulerWalk,
        noop = function () {},
        time = 0,
        renders = {};

    /**
     * Main object constructor represeting any node created
     * @param {[type]} conf the object that has the information about the node
     *                      that will be created
     * @param {[type]} trg  the DomNODE where the element will be appended to
     * @param {[type]} mapcnt an object used to allow the access from any node
     *                        to every node that has the gindID attribute
     */
    function Wnode(conf, trg, mapcnt) {
        
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
        this.node = document.createElement(tag);

        // save a reference to the node configuration
        // will be useful on append to append to conf.target
        // if specified
        //
        this.conf = conf;

        // save a reference to the node callback if speficied
        // otherwise create a function that do nothing but
        // freeing the parent promise from waiting
        //
        this.WIDGZARD_cb = conf.cb || function () {
            debug && console.log('autoresolving  ', self.node);
            // autoresolve
            self.resolve();
        };

        // a reference the the root
        //
        this.root = mapcnt.root;

        // save a reference to the parent
        // 
        this.parent = trg;

        // save a reference to a brand new Promise
        // the Promise.node() will be called as far as
        // all the child elements cb have called 
        // this.done OR this.resolve
        // 
        this.WIDGZARD_promise = Promise.create();

        // When called Promise.done means that 
        // the parent callback can be called
        // delegating the parent context
        //
        this.WIDGZARD_promise.then(self.WIDGZARD_cb, self);

        // as said at the beginning every node keeps a reference
        // to a function that allow to get a reference to any
        // node that in his configuration has a `nodeIdentifier` value
        // specified
        //
        this.map = mapcnt.map;

        //function to abort all
        this.abort = mapcnt.abort;

        // publish in the node the getNode fucntion that allows for
        // getting any node produced from the same json having a 
        // `nodeIdentifier` with a valid value
        this.getNode = mapcnt.getNode;


        // get all nodes mapped
        this.getNodes = mapcnt.getNodes;

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
    Wproto.climb = function (n) {
        n = n || 1;
        var ret = this;
        while (n--) {
            ret = ret.parent;
        }
        return ret;
    };


    /**
     * and one to go down
     * @return {[type]} [description]
     */
    Wproto.descendant = function () {
        var self = this,
            args = Array.prototype.slice.call(arguments, 0),
            i = 0,
            res = self,
            l = args.length;
        if (!l) return res;
        while (i < l) {
            res = res.childrens[~~args[i++]];
        }
        return res;
    };

    /**
     * Set neo attributes
     * @param {DOMnode} node  the node
     * @param {Object} attrs  the hash of attributes->values
     */
    Wproto.setAttrs = function (node, attrs) {
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
    Wproto.setStyle = function (node, style) {
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
    Wproto.setData = function (el, data) {
        el.data = data || {};
        return this;
    };

    /**
     * [checkInit description]
     * @param  {[type]} el [description]
     * @return {[type]}    [description]
     */
    Wproto.checkInit = function (el, conf) {
        var keepRunning = true;
        if ('init' in conf && typeof conf.init === 'function') {
            keepRunning = conf.init.call(el);
            !keepRunning && el.abort();
        }
        return this;
    }

    /**
     * [checkInit description]
     * @param  {[type]} el [description]
     * @return {[type]}    [description]
     */
    Wproto.checkEnd = function (el, conf) {
        if ('end' in conf && typeof conf.end === 'function') {
            this.root.endFunctions.push(function () {conf.end.call(el);});
        }
        return this;
    }
    
    /**
     * add method for the Wnode
     */
    Wproto.add = function () {

        var conf = this.conf,
            node = this.node,
            tmp;

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
        typeof conf.html !== 'undefined' && (node.innerHTML = conf.html);

        // if `text` is found on node conf
        // it will be appended
        //  
        if (typeof conf.text !== 'undefined') {
            tmp = document.createTextNode("" + conf.text);
            node.appendChild(tmp);
        }

        // if the node configuration has a `nodeIdentifier` key
        // (and a String value), the node can be reached 
        // from all others callback invoking
        // this.getNode(keyValue)
        //
        
        if (typeof conf[nodeIdentifier] !== 'undefined') {
            this.map[conf[nodeIdentifier]] = this;
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
            keys = [
                'WIDGZARD', 'WIDGZARD_cb', 'WIDGZARD_promise', 'WIDGZARD_length',
                'parent', 'getNode', 'climb', 'root', 'done', 'resolve', 'data'
            ],
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

        nodesToBeCleaned = null, keys = null;

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
                reload : function () {
                    render(params, true);
                }
            },
            targetFragment = {
                node : document.createDocumentFragment('div')
            },
            active = true,
            originalHTML = target.node.innerHTML + "",
            t2;
        
        // debug ? 
        debug = !!params.debug;

        // maybe cleanup previous
        //
        autoclean && target.WIDGZARD && cleanupWnode(target)

        if (!params) {
            throw new Exception('ERROR : Check parameters for render function');
        }

        // a literal used to save a reference 
        // to all the elements that need to be 
        // reached afterward calling this.getNode(id)
        // from any callback
        // 
        var mapcnt = {
            root : target,
            map : {},
            getNode : function (id) {
                return mapcnt.map[id] || false;
            },
            getNodes : function () {
                return mapcnt.map;
            },
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
        Wproto
            .setAttrs(target.node, params.attrs)
            .setStyle(target.node, params.style)
            .setData(target, params.data)
            .setData(targetFragment, params.data);

        target.descendant = Wproto.descendant;
        targetFragment.descendant = Wproto.descendant;
        
        // maybe clean
        // 
        if (!!clean) target.node.innerHTML = '';

        // maybe a raw html is requested before treating content
        // 
        if (typeof params.html !== 'undefined') {
            target.node.innerHTML = params.html;
        }
        
        // initialize the root node to respect what is needed
        // by the childs node Promise 
        // 
        // - len : the lenght of the content array
        // - cb : exactly the end callback
        // 
        target.WIDGZARD_len = params.content ? params.content.length : 0;
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
        target.WIDGZARD = true;

        // allow to use getNode & getNodes from root
        // 
        target.getNode = targetFragment.getNode = mapcnt.getNode;
        target.getNodes = targetFragment.getNodes = mapcnt.getNodes;
        target.abort = targetFragment.abort = mapcnt.abort;


        // what about a init root function?
        // 
        Wproto.checkInit(targetFragment, params);
        

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
                    if (cnf.content[i] === clearerClassName) {
                        cnf.content[i] = {
                            tag : 'br',
                            attrs : {'class' : clearerClassName}
                        };
                    }
        
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
        if (name && !(name in renders)) renders[name] = target;

        t2 = +new Date();
        
        console.debug('Widgzard render time: ' + (t2-t1) + 'ms');
        
        return target;
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
        s.src = src;
        
        // when finished remove the script tag
        s.onload = function () {
            s.parentNode.removeChild(s);
        }
    };

    /**
     * [eulerWalk description]
     * @param  {[type]} root [description]
     * @param  {[type]} func [description]
     * @param  {[type]} mode [description]
     * @return {[type]}      [description]
     */
    eulerWalk = function (root, func, mode) {
        mode = {pre : 'pre', post : 'post'}[mode] || 'post';
        var nope = function () {},
            pre = mode === 'pre' ? func : nope,
            post = mode === 'post' ? func : nope,
            walk = (function () {
                return function (n_, _n) {
                    pre(n_);
                    _n = n_.firstChild;
                    while (_n) {
                        walk(_n);
                        _n = _n.nextSibling;
                    }
                    post(n_);
                };
            })();
        walk(root);
    };

    /**
     * Dummy delegation function 
     * @param  {[type]} func [description]
     * @param  {[type]} ctx  [description]
     * @return {[type]}      [description]
     */
    delegate = function (func, ctx) {
    
        // get relevant arguments
        // 
        var args = Array.prototype.slice.call(arguments, 2);
        
        // return the function
        //
        return function() {
            return func.apply(
                ctx || window,
                [].concat(args, Array.prototype.slice.call(arguments))
            );
        };
    };

    /**
     * [htmlspecialchars description]
     * @param  {[type]} c [description]
     * @return {[type]}   [description]
     */
    htmlspecialchars = function (c) {
        return '<pre>' +
            c.replace(/&(?![\w\#]+;)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;') +
        '</pre>';
    };

    // publish module
    // 
    FG.Widgzard = {
        render : render,
        cleanup : cleanup,
        get : get,
        load : load,
        htmlspecialchars : htmlspecialchars,
        // Promise : Promise,
        
        getElement : function(n) {
            return n in renders ? renders[n] : false;
        },
        getElements : function () {
            return renders;
        }
    };

})(this);
/*------------------------*/
/*
[MALTA] ../engy/engy2.js
*/
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


FG.makeNS('engy2', function () {

	var components = {},
		CONST = {
			fileNameSeparator : "/",
			ext : ".js"
		},
		Engy = {
			config : {
			    componentsUrl : '/engy/components/'
			}
		};


	function _overwrite(ns, path, o) {
		var pathEls = path.split(/\.|\//),
			i = 0, l = pathEls.length;

		if (l > 1) 
			for (null; i < l-1; i++)
				ns = ns[pathEls[i]];
		
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


	function Processor(config) {
		this.retFuncs = [];
		this.config = config;
		this.endPromise = FG.Promise.create();
	}
	
	Processor.prototype.run = function () {
		var self = this,
			foundComponents = FG.object.digForKey(self.config, 'component'),
			myChain = [],
			l = foundComponents.length,
			i; 
		
		if (l) {

			for (i = 0; i < l; i++)

				(function (j) {
					myChain.push(function (pro) {
						
						var componentName = Engy.config.componentsUrl  + foundComponents[j].value + CONST.ext,
							cached = componentName in components;

						function cback(xhrResponseText) {


							var params = FG.checkNS(foundComponents[j].container + '/params', self.config),
								obj,
								usedParams, foundParam, foundParamValue, foundParamValueReplaced, i, l;

							// maybe is not already cached
							//
							if (!cached) {
								components[componentName] = xhrResponseText;
							}

							obj = eval('(' + xhrResponseText.replace(/\/n|\/r/g, '').replace(/^[^{]*/, '').replace(/;?$/, '') + ')');

							// before merging the object I check for the presence of parameters
							//
							if (params) {

								// check if into the component are used var placeholders
								// 
								usedParams = FG.object.digForValue(obj, /#PARAM{([^}|]*)?\|?([^}]*)}/);

								l = usedParams.length;

								if (l) {

									for (i = 0; i < l; i++) {
										
										// check if the label of the placeholder is in the params
										//
										foundParam = FG.checkNS(usedParams[i].regexp[1], params);
										
										// in case use it otherwise, the fallback otherwise cleanup
										//
										foundParamValue = foundParam ? foundParam : (usedParams[i].regexp[2] || "");
										
										// string or an object?
										//
										if ((typeof foundParamValue).match(/string/i)){

											foundParamValueReplaced = FG.checkNS(usedParams[i].path, obj)
												.replace(usedParams[i].regexp[0],  foundParamValue);
											
											_overwrite(obj, usedParams[i].path, foundParamValueReplaced);
										} else {
											_overwrite(obj, usedParams[i].path, foundParamValue);
										}
									}
								}
							}


							_mergeComponent(self.config, foundComponents[j].container, obj);

							// file got, solve the promise
							// 
							pro.done();
						}

						
						// maybe is cached
						//
						cached ?
							cback (components[componentName])
							:
							FG.io.get(componentName, cback, true);	
					});
				})(i);
			

			// solve & recur
			//
			FG.Promise.chain(myChain).then(function () {
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


	Engy.process = function (c) {
		// var config = [].slice.call(arguments, 0)[0];
		// return (new Processor(config)).run();
		return (new Processor(c)).run();
	};

	Engy.render = function (params, clean, name) {
		var t = +new Date,
			pRet = FG.Promise.create();

		FG.engy2.process( params ).then(function(p, r) {
		    var r = FG.Widgzard.render(r[0], clean, name);
		    console.log('t: ' + (+new Date - t));
		    pRet.done(r);
		});
		return pRet;
	};

	return Engy;

}, FG);
