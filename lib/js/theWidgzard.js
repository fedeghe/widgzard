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
[Malta] lib.js
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
[Malta] ../url.js
*/
FG.url = (function () {

	var _hash = [],
		_urlHash = {
			get : function () {
				return document.location.hash;
			},
			set : function () {
				_hash = [].slice.call(arguments, 0);
				document.location.hash = '#/' + _hash.join('/');
			}
		};

	function getHash() {
		var h = _urlHash.get().replace(/^\#\/?/, '');
		if (h.length)
			return _hash = h.split(/\//);
		return false;
	}

	function setHash() {
		var arg = [].slice.call(arguments, 0).filter(function (el) {return el.length;});
		_urlHash.set.apply(null, arg);
	}

	return {
		hash : _hash,
		getHash : getHash,
		setHash : setHash
	}
}());
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

        if(!what.match(/key|value|keyvalue/)) {
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
                },
                keyvalue : function (k1, k2, keyval) {
                    return (
                        (FG.object.isString(k1) && keyval.key instanceof RegExp) ?
                        k1.match(keyval.key)
                        :
                        jCompare(k1, keyval.key)
                    ) && (

                        (FG.object.isString(k2) && keyval.value instanceof RegExp) ?
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
            return digFor('value', o, kv, lim);
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

/*
[Malta] widgzard.js
*/
/*
[Malta] ../promise.js
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
		__promise = FG.Promise,
		// noop = function () {},
		// time = 0,
		__renders = {};

	/*
	[Malta] ../Wnode.js
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
		
		"use strict"
	
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
		while (n--) {
			ret = ret.parent;
		}
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
	}
	
	/**
	 * [checkInit description]
	 * @param  {[type]} el [description]
	 * @return {[type]}    [description]
	 */
	Wnode.prototype.checkEnd = function (el, conf) {
		if ('end' in conf && typeof conf.end === 'function') {
			this.root.endFunctions.push(function () {conf.end.call(el);});
		}
		return this;
	}
	
	/**
	 * add method for the Wnode
	 */
	Wnode.prototype.add = function () {
	
		var conf = this.conf,
			node = this.node,
			tmp,i,j,k;
	
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
			node.innerHTML = conf.html;
	
	
			/**
			 * ABSOLUTELY EXPERIMENTAL 2WDB
			 */
			tmp = node.innerHTML.match(/2wdb\((.*)\)/);
			if (tmp) {
				
				i = FG.checkNS(tmp[1], this);
				if (i !== undefined) {
					j = ('this.' + tmp[1]).split('.');
					k = j.pop();
					// console.log(j, k)
					i = eval(j.join('.'));
					// console.log(i)
					k in i && FG.events.ww.on(i, k, node);
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
		__autoclean && target.WIDGZARD && cleanupWnode(target)

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
			target.node.innerHTML = params.html;
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
	    }

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
		// 
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
    };

	// publish module
	// 
	FG.Widgzard = {
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
FG.makeNS('engy', function () {

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
		for (i in componentPH)
			!(i.match(/component|params/)) && (merged[i] = componentPH[i]);

		_overwrite(ns, path, merged);
	}

	function Processor(config) {
		// console.log(config)
		this.config = config;
		this.endPromise = FG.Promise.create();
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

		return config.componentsUrl  + res + config.ext;
	};

	
	/**
	 * [run description]
	 * @return {[type]} [description]
	 */
	Processor.prototype.run = function () {
		var self = this,
			langFunc = FG.i18n.parse,
			elementsN = 0,
			countPromise = FG.Promise.create(),
			solveTime = FG.Promise.create(),
			start = +new Date(), end,
			xhrTot = 0,
			cback;


		(function solve() {
			var component = FG.object.digForKey(self.config, 'component', 1),
				componentName,
				
				cached, preLoaded,

				innerPromise = FG.Promise.create(),
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

				// console.log(componentName, preLoaded)

				cback = function (cntORobj) {
					xhrEnd = +new Date;
					xhrTot += xhrEnd - xhrStart;

 					var params = FG.checkNS(component.container + '/params', self.config),
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


//
//
//					if (!cached) {
//						components[componentName] = xhrResponseText;
//					}
//					
//					xhrResponseText = xhrResponseText.replace(/^[^{]*/, '')
//									.replace(/;?$/, '');
//
//					obj = eval('(' + xhrResponseText + ')');




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
								foundParamValue = typeof foundParam !== 'undefined' ? foundParam : (usedParams[i].regexp[2] || "");
								
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
					if (component.container) {
						_mergeComponent(self.config, component.container, obj);
					} else {
						self.config = obj;
					}

					innerPromise.done();
				};

				// maybe is cached
				//
				xhrStart = +new Date;

				if (preLoaded) {
					cback (preloadedComponents[componentName]);
				} else if (cached) {
					cback (components[componentName]);
				} else {
					FG.io.get(componentName, cback, true);
				}
			}
		})();

		// now i18n, maybe
		//
		langFunc && langFunc(self.config);
		

		countPromise.then(function (pro ,par){
			console.log("Engy components used: " + par[0]);
		});

		solveTime.then(function (pro ,par){
			console.log("Engy time for getting components via xhr: " + xhrTot);
			console.log("      \"       unfolding : " + (par[0] - xhrTot));
			console.log("      \"       solving (xhr included): " + par[0]);
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
		configSet : _configSet,
		process : _process,
		component : _component,
		components : _components,
		get  : function (params, clean, name) {
			var pRet = FG.Promise.create();
			_process(params).then(function(p, r) {
			    pRet.done(FG.Widgzard.get(r[0]));
			});
			return pRet;
		},
		load : function (src) {
			return FG.Widgzard.load(src);	
		},
		getElement : function(n) {
			return FG.Widgzard.getElement(n);
		},
		getElements : function () {
			return FG.Widgzard.getElements();
		},
		render : function (params, clean, name) {
			var self = this,
				t = +new Date,
				pRet = FG.Promise.create();

			_process(params).then(function(p, r) {
			    console.log('t: ' + (+new Date - t));
			    pRet.done(FG.Widgzard.render(r[0], clean, name));
			});
			return pRet;
		}
	};
}, FG);
