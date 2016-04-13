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
        var chr = '.',
            els = str.split(/\.|\//),
            l = els.length,
            _u_ = 'undefined',
            ret;
        (typeof ctx === _u_) && (ctx = window);
        (typeof obj === _u_) && (obj = {});
        //
        if (!ctx[els[0]]) {
            ctx[els[0]] = (l === 1) ? obj : {};
        }
        ret = ctx[els[0]];
        return (l > 1) ? makens(els.slice(1).join(chr), obj, ctx[els[0]]) : ret;
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
})('$ns$');

