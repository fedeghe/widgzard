/* eslint-disable no-console */
/**
 * Autoexecuted closure that allows to create namespaces,
 * the autocall is used to put the function itself in a namespace
 *
 */
(function () {
    // this is due, to test all implications see
    // http://www.jmvc.org/test_strict?ga=false
    // (the ga=false params inhibits google analytics tracking)
    'use strict';

    var allowLog = true,
        allowDebug = true,
        _AP_ = Array.prototype;

    /**
     * Creates a namespace
     * @param  {String} str     dot or slash separated path for the namespace
     * @param  {Object literal} [{}]obj optional: the object to be inserted in the ns, or a function that returns the desired object
     * @param  {[type]} ctx     [window] the context object where the namespace will be created
     * @return {[type]}         the brand new ns
     *
     * @hint This method is DESTRUCTIVE if the obj param is passed,
     *       a conservative version is straight-forward
     * @sample
     *     makens('SM', {hello: ...});
     *     makens('SM', {hi: ...}); // now hello exists no more
     *
     *     //use
     *     makens('SM', {hello: ..., hi: })
     *     // or if in different files
     *     // file1
     *     makens('SM')
     *     SM.hello = ...
     *     //
     *     // file2
     *     makens('SM')
     *     SM.hi = ...
     *
     *     makens('SM/proto', function () {
     *
     *          // some private stuff
     *          //
     *
     *          return {
     *              foo0 : function () {...},
     *              foo1 : function () {...}
     *          }
     *     })
     *
     */
    function makens (str, obj, ctx) {
        str = str.replace(/^\//, '');
        var els = str.split(/\.|\//),
            l = els.length,
            ret;

        // default context window
        //
        (typeof ctx === _U_) && (ctx = NS);

        // default object empty
        //
        (typeof obj === _U_) && (obj = {});

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

    function checkns (ns, ctx) {
        // remove stating slash
        ns = ns.replace(/^\//, '');

        // get all elements splitting by . or /
        var els = ns.split(/\.|\//),
            i = 0,
            l = els.length;
        ctx = (typeof ctx !== _U_) ? ctx : _context_;

        if (!ns) {
            return ctx;
        }

        for (null; i < l; i += 1) {
            if (typeof ctx[els[i]] !== _U_) {
                ctx = ctx[els[i]];
            } else {
                // break it
                return undefined;
            }
        }
        return ctx;
    }

    function extendns (ns, objfn) {
        var i,
            obj = typeof objfn === 'function' ? objfn() : objfn;
        for (i in obj) {
            if (typeof ns[i] === _U_) {
                ns[i] = obj[i];
            }
        }
    }

    // use makens to publish itself and something more
    //
    NS.makeNs = makens;
    NS.checkNs = checkns;
    NS.extendNs = extendns;
    NS.debug = function () {
        var args = _AP_.prototype.slice.call(arguments, 0);
        allowDebug && 'debug' in console && console.debug.apply(console, args);
    };
    NS.log = function () {
        var args = _AP_.prototype.slice.call(arguments, 0);
        allowLog && 'log' in console && console.log.apply(console, args);
    };

    NS.dbg = function (m) {
        // maybe shut up
        if (!allowDebug) { return void 0; }
        try {
            console.log(m);
        } catch (e1) {
            try {
                // eslint-disable-next-line no-undef
                W.opera.postError(m);
            } catch (e2) {
                W.alert(m);
            }
        }
    };

    // use it again to define a function to get
    // uniqueid
    NS.makeNs('utils', {
        /**
         * useful to get a unique id string
         * @return {String} the wanted id
         */
        /* eslint-disable */
        uniqueId: new function () {
            var count = 0,
                self = this;
            this.prefix = 'NS_';
            this.toString = function () {
                count += 1;
                return self.prefix + count;
            };
        },
        /* eslint-enable */
        eulerWalk: function (root, func, mode) {
            mode = { pre: 'pre', post: 'post' }[mode] || 'post';
            var nope = function () { },
                pre = mode === 'pre' ? func : nope,
                post = mode === 'post' ? func : nope;

            (function walk (n_, _n) {
                pre(n_);
                _n = n_.firstChild;
                while (_n) {
                    walk(_n);
                    _n = _n.nextSibling;
                }
                post(n_);
            })(root);
        },
        replaceDataInTxt: function (str, data) {
            return str.replace(/\$([A-z]*)\$/g, function (str, $1) {
                var out = $1.replace(/\$/g, '');
                return (out in data) ? data[out] : '';
            });
        },
        toMemFormat: function (size, post) {
            'use strict';
            if (!size) return size + (post || '');
            var div = 2 << 9,
                units = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
                index = 0;
            while (size / Math.pow(div, index + 1) > 1) {
                index++;
            }
            return [
                (size / Math.pow(div, index)).toFixed(2).replace(/\.?0+$/, ''),
                units[index],
                post || ''
            ].join('');
        },
        getViewportSize: function () {
            var WDE = WD.documentElement;
            if (typeof W.innerWidth !== _U_) {
                return {
                    width: W.innerWidth,
                    height: W.innerHeight
                };
            } else {
                if (typeof WDE !== _U_
                    && typeof WDE.clientWidth !== _U_
                    && WDE.clientWidth !== 0
                ) {
                    return {
                        width: WDE.clientWidth,
                        height: WDE.clientHeight
                    };
                } else {
                    return {
                        width: WD.getElementsByTagName('body')[0].clientWidth,
                        height: WD.getElementsByTagName('body')[0].clientHeight
                    };
                }
            }
        },
        // isMobile: (function () {
        //     var ua = navigator.userAgent || navigator.vendor || W.opera;
        //     return /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|playbook|silk/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
        // })(),
        isMobile: function () {
            return (typeof W.matchMedia !== _U_ || typeof W.msMatchMedia !== _U_)
                && W.matchMedia('(pointer:coarse)').matches;
        }
    });
})();
