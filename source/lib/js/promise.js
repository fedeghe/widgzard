/**
 * [Channel description]
 * @param {[type]} n [description]
 */
NS.Promise = (function () {

    // MY WONDERFUL Promise Implementation .... that's shit
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

    /* returning module
    */
    return {
        create: function() {
            return new _Promise();
        }
    };
    
})();