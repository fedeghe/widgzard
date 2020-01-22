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
})();
