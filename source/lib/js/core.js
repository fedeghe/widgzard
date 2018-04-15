/**
 * Autoexecuted closure that allows to create namespaces,
 * the autocall is used to put the function itself in a namespace
 * 
 */
(function (){
    // this is due, to test all implications see
    // http://www.jmvc.org/test_strict?ga=false
    // (the ga=false params inhibits google analytics tracking)
    'use strict';

    var allowLog = true,
        allowDebug = true,
        _u_ = 'undefined';

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
    function makens(str, obj, ctx) {
        str = str.replace(/^\//, '');
        var els = str.split(/\.|\//),
            l = els.length,
            ret;

        // default context window
        // 
        (typeof ctx === _u_) && (ctx = NS);

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
        ctx = (typeof ctx !== _u_) ? ctx : _context_;

        if (!ns) {
            return ctx;
        }

        for (null; i < l; i += 1) {

            if (typeof ctx[els[i]] !== _u_) {
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
            if (typeof ns[i] === 'undefined') {
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
        var args = Array.prototype.slice.call(arguments, 0);
        allowDebug && 'debug' in console && console.debug.apply(console, args);
    };
    NS.log = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        allowLog && 'log' in console && console.log.apply(console, args);
    };

    NS.dbg = function (m) {
        // maybe shut up
        if (!allowDebug) {return void 0;}
        try {console.log(m);} catch(e1) {try {opera.postError(m);} catch(e2){alert(m);}}
    };
    
    // use it again to define a function to get
    // uniqueid
    NS.makeNs('utils', {
        /**
         * useful to get a unique id string
         * @return {String} the wanted id
         */
        uniqueId : new function () {
            var count = 0,
                self = this;
            this.prefix = 'NS_';
            this.toString = function () {
                count += 1;
                return self.prefix + count;
            };
        }
    });
})();
