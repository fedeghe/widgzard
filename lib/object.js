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