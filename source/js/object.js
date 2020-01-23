(function () {
    'use strict';

    /**
     * maps an object literal to a string according using the map function  passed
     * @param  {Literal}   o  the object literal
     * @param  {Function} fn  the map function
     * @return {String}       the resulting string
     */
    function strMap (o, fn) {
        var ret = '',
            j;
        for (j in o) {
            if (o.hasOwnProperty(j)) {
                ret += fn(o, j, ret);
            }
        }
        return ret;
    }

    function jCompare (obj1, obj2) {
        // avoid tags
        return !isNode(obj1)
        && typeof JSON !== _U_
            ? JSON.stringify(obj1) === JSON.stringify(obj2)
            : obj1 === obj2;
    }

    // Returns true if it is a DOM node
    //
    function isNode (o) {
        return (
            typeof Node === 'object'
                ? o instanceof W.Node
                : o
                    && typeof o === 'object'
                    && typeof o.nodeType === 'number'
                    && typeof o.nodeName === 'string'
        );
    }

    function extract (data, where) {
        var key,
            g = where || (typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : this));
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                g[key] = data[key];
            }
        }
    }

    // Returns true if it is a DOM element
    //
    // function isElement (o) {
    //     return (
    //         typeof HTMLElement === 'object'
    //             ? o instanceof W.HTMLElement
    //             : o
    //                 && o !== null
    //                 && typeof o === 'object'
    //                 && o.nodeType === 1
    //                 && typeof o.nodeName === 'string'
    //     );
    // }

    /**
     * returning module
     */
    NS.makeNs('object', {
        extract: extract,
        fromQs: function () {
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

        clone: function (obj) {
            var self = NS.object,
                copy,
                i, l;
            // Handle the 3 simple types, and null or undefined
            if (obj === null || typeof obj !== 'object') {
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
            throw new Error('Unable to copy obj! Its type isn\'t supported.');
        },

        extend: function (o, ext, force) {
            var obj = NS.object.clone(o),
                j;
            for (j in ext) {
                if (ext.hasOwnProperty(j) && (!(j in obj) || force)) {
                    obj[j] = ext[j];
                }
            }
            return obj;
        },

        keyize: function (objArr, k) {
            var objRet = {},
                i = 0,
                l = objArr.length;
            for (null; i < l; i++) {
                if (k in objArr[i] && !(objArr[i][k] in objRet)) {
                    objRet[objArr[i][k]] = objArr[i];
                }
            }
            return objRet;
        },

        isString: function (o) {
            return typeof o === 'string' || o instanceof String;
        },

        jCompare: jCompare,

        /**
         * uses strMap private function to map an onject literal to a querystring ready for url
         * @param  {Literal} obj    the object literal
         * @return {String}         the mapped object
         */
        toQs: function (obj) {
            return strMap(obj, function (o, i, r) {
                return ([
                    r ? '&' : '?',
                    encodeURIComponent(i),
                    '=',
                    encodeURIComponent(o[i])
                ].join('')).replace(/'/g, '%27');
            });
        }
    });
})();
