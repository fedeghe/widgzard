$NS$.object = (function (){

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
                    return ($NS$.object.isString(k1) && key instanceof RegExp) ?
                        k1.match(key)
                        :
                        jCompare(k1, key);
                },
                value : function (k1, k2, val) {
                    
                    var v =  ($NS$.object.isString(k2) && val instanceof RegExp) ?
                        k2.match(val)
                        :
                        jCompare(k2, val);
                    
                    return v;
                },
                keyvalue : function (k1, k2, keyval) {
                    return (
                        ($NS$.object.isString(k1) && keyval.key instanceof RegExp) ?
                        k1.match(keyval.key)
                        :
                        jCompare(k1, keyval.key)
                    ) && (

                        ($NS$.object.isString(k2) && keyval.value instanceof RegExp) ?
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
        fromQs : function () {
            var els = document.location.search.substr(1).split('&'),
                i, len, tmp, out = [];

            for (i = 0, len = els.length; i < len; i += 1) {
                tmp = els[i].split('=');

                // do not override extra path out
                // 
                !out[tmp[0]] && (out[tmp[0]] = decodeURIComponent(tmp[1]));
            }
            return out;
        },

        clone: function(obj) {
            var self = $NS$.object,
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
            var obj = $NS$.object.clone(o),
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