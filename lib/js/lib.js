/*




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
													^"===*"`                              v.0.2


 * Widgzard module
 * 
 * Create an arbitrary dom tree json based allowing for each node to 
 * specify a callback that will be called only when either
 *   > the node is appended (in case the node is a leaf)
 * ||
 *   > every child has finished (explicitly calling the done function on his context)
 *
 * @author Federico Ghedina <federico.ghedina@gmail.com> <2017>
 *
 *

*/
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
[Malta] ../util.js
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
    },
    getViewportSize : function () {
        if (typeof window.innerWidth != 'undefined') {
            return {
                width : window.innerWidth,
                height : window.innerHeight
            };
        } else {
            if (typeof window.document.documentElement != 'undefined' &&
                typeof window.document.documentElement.clientWidth != 'undefined' &&
                window.document.documentElement.clientWidth != 0
            ) {
                return {
                    width : window.document.documentElement.clientWidth,
                    height : window.document.documentElement.clientHeight
                };
            } else {
                return {
                    width : window.document.getElementsByTagName('body')[0].clientWidth,
                    height : window.document.getElementsByTagName('body')[0].clientHeight
                };
            }
        }
    },
    isMobile : (function () {
        var ua = navigator.userAgent || navigator.vendor || window.opera;
        return /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|playbook|silk/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
    })()
};
/*
[Malta] ../object.js
*/
FG.object = (function (){

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
         * uses str_map private function to map an onject literal to a querystring ready for url
         * @param  {Literal} obj    the object literal
         * @return {String}         the mapped object
         */
        toQs : function (obj) {
            return str_map(obj, function (o, i, r) {
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
[Malta] ../io.js
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
[Malta] ../css.js
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
[Malta] ../dom.js
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
        parent && parent.removeChild(el);
    }
};
/*
[Malta] ../events.js
*/
FG.makeNS('FG/events');


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

    FG.events.onNoEvent = function (el, f, t) {
        t = t || 3000;
        var to,
            self = FG.events;
        function inner(e) {
            to && window.clearTimeout(to);
            to = window.setTimeout(function () { f(e); }, t);
        }
        self.on(el, 'mousemove', inner);
        self.on(el, 'click', inner);
        self.on(el, 'touchstart', inner);
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

    /**
     * my 2 way databinding
     */
    FG.events.ww = {
        on : function (obj, field,  el, debugobj) {
            var objLock = false,
                elLock = false,
                elDet = _.events.getElementDeterminant(el),
                elOldVal = el[elDet],
                objOldVal = obj[field],
                lock = function(m) {
                    objLock = elLock = !!m;
                };

            el.wwdbID = "_" + FG.util.uniqueid;

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
            FG.events.on(el, 'keyup', function () {
                if (elLock) return;
                lock(true);
                if (this[elDet] != obj[field]) {
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
                FG.events.off(els[l], 'keyup');
                window.clearInterval(_.events.wwdb_bindings[els[l].wwdbID]);    
            }
        }
    };

})();


/*
[Malta] ../string.js
*/
// -----------------+
// STRING sub-module |
// -----------------+

// public section
FG.string = {
    /**
     * [ description]
     * @param  {Array[int]} code [description]
     * @return {[type]}      [description]
     */
    code2str : function (code) {
        return String.fromCharCode.apply(null, code);
    },


    
    /**
     * [multireplace description]
     * @param  {[type]} cnt [description]
     * @param  {[type]} o   [description]
     * @return {[type]}     [description]
     */
    multireplace : function (cnt, o) {
        for (var i in o) {
            cnt = cnt.replace(o[i], i);
        }
        return cnt;
    },

    /**
     * [regEscape description]
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     *
     * http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
     */
    regEscape : function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    },
    /**
     * [ description]
     * @param  {[type]} str [description]
     * @param  {[type]} n   [description]
     * @return {[type]}     [description]
     */
    repeat : function (str, n) {
        return new Array(n + 1).join(str);
    },
    /** 
     * [ description]
     * @param  {string} tpl      the template
     * @param  {literal or function} a literal for substitution or a function that will
     *                               return the substitution given as parameter a string
     * @param  {string} start       optional- the opening placeholder delimitator (%)
     * @param  {string} end       optional- the closing placeholder delimitator (%)
     * @param  {string} fallback optional- a fallback value in case an element is not found
     * @return {string}          the resulting string with replaced values
     *
     * this allows
    var tpl = 'a%x%g',
       o = {
           x : 'b%y%f',
           y:'c%z%e',
           z : 'd'
       };
    FG.string.replaceAll(tpl, o); // abcdefg
     * 
     */
    replaceAll : function (tpl, obj, options) {

        var start = '%',
            end = '%',
            fb = null,
            clean = false,
            reg,
            straight = true,
            str, tmp, last;

        if (undefined != options) {
            if ('delim' in options) {
                start = options.delim[0];
                end = options.delim[1];
            }
            if ('fb' in options) {
                fb = options.fb;
            }
            clean = !!options.clean;
        }

        reg = new RegExp(start + '(\\\+)?([A-z0-9-_\.]*)' + end, 'g');

        while (straight) {
            if (!(tpl.match(reg))) {
                return tpl;
            }
            tpl = tpl.replace(reg, function (str, enc, $1, _t) {
                
                if (typeof obj === 'function') {
                    /**
                     * avoid silly infiloops */
                    tmp = obj($1);
                    _t = (tmp !== start + $1 + end) ? obj($1) : $1;

                } else if ($1 in obj) {

                    _t = typeof obj[$1];
                    if (_t === 'function') {
                        _t = obj[$1]($1);
                    } else if (_t === 'object') {
                        _t = '';
                    } else {
                        _t= obj[$1];
                    }
                    // incomplete when the placeholder points to a object (would print)
                    // _t = typeof obj[$1] === 'function' ? obj[$1]($1) : obj[$1];
                    
                /**
                 * not a function and not found in literal
                 * use fallback if passed or get back the placeholder
                 * switching off before returning
                 */
                } else {
                    /* @ least check for ns, in case of dots
                    */
                    if ($1.match(/\./)) {
                        last = FG.checkNS($1 ,obj);
                        if (last) {
                            _t = enc ? encodeURIComponent(last) : last;
                            return typeof last === 'function' ? last($1) : last;
                        }
                    }
                    // but do not go deeper   
                    straight = false;
                    _t = fb !== null ? fb : clean ? '' : start + $1 + end;
                }
                return enc ? encodeURIComponent(_t): _t;
            });
        }
        return tpl;
    },
    //
    //
    //
    
    /**
     * [ description]
     * @param  {[type]} str [description]
     * @param  {[type]} pwd [description]
     * @return {[type]}     [description]
     */
    str2code : function (str) {
        var out = [],
            i = 0,
            l = str.length;
        while (i < l) {
            out.push(str.charCodeAt(i));
            i += 1;
        }
        return out;
    },

    /**
     * [str2hex description]
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    str2hex : function (str) {
        
        var out = [],
            i = 0,
            l = str.length;
        while (i < l) {
            out.push(
                '\\X' + 
                parseInt(str.charCodeAt(i), 10).toString(16).toUpperCase()
            );
            i += 1;
        }
        return "" + out.join('').replace(/X/g, "x");
    },

    /**
     * [ description]
     * @param  {[type]} s){return s.replace(/^\s+|\s+$/g [description]
     * @param  {[type]} ''         [description]
     * @return {[type]}            [description]
     */
    trim : function (s) {return s.replace(/^\s+|\s+$/g, ''); },

    /**
     * [ description]
     * @param  {[type]} s){return s.replace(/^\s+/g [description]
     * @param  {[type]} ''         [description]
     * @return {[type]}            [description]
     */
    triml : function (s) {return s.replace(/^\s+/g, ''); },

    /**
     * [ description]
     * @param  {[type]} s){return s.replace(/\s+$/g [description]
     * @param  {[type]} ''         [description]
     * @return {[type]}            [description]
     */
    trimr : function (s) {return s.replace(/\s+$/g, ''); },

    /**
     * [ucFirst description]
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    ucFirst : function (str) {
        return str.replace(/^\w/, function (chr) {return chr.toUpperCase(); });
    }
    
};

//-----------------------------------------------------------------------------
/*
[Malta] ../channel.js
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
[Malta] ../i18n.js
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
				replacing = FG.object.digForValue(obj, /i18n\(([^}|]*)?\|?([^}]*)\)/),
				mayP, ref, i, l;
			
			for (i = 0, l = replacing.length; i < l; i++) {
				
				if ((typeof replacing[i].regexp).match(/boolean/i)) continue;

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
