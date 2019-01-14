/**
 * [Channel description]
 * @param {[type]} n [description]
 */
NS.Channel = (function () {
    "use strict";
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
            while (l >= 0 && arr[l] !== mvar) l--;
            return l;
        },

        _Channel = function () {
            this.topic2cbs = {};
            this.lateTopics = {};
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
        enable: function () {
            this.enabled = true;
        },

        /**
         * disable cb execution on publish
         * @return {undefined}
         */
        disable: function () {
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
        pub: function (topic, args) {
            var i = 0,
                l;
            if (!(topic in this.topic2cbs) || !this.enabled) {
                //save it for late pub, at everysub to this topic
                if (topic in this.lateTopics) {
                    this.lateTopics[topic].push({ args: args });
                } else {
                    this.lateTopics[topic] = [{ args: args }];
                }
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
        sub: function (topic, cb, force) {
            var i = 0,
                l;
            if (topic instanceof Array) {
                for (l = topic.length; i < l; i += 1) {
                    this.sub(topic[i], cb, force);
                }
            }
            if (!(topic in this.topic2cbs) || !this.enabled) {
                this.topic2cbs[topic] = [];
            }
            if (!force && findInArray(this.topic2cbs[topic], cb) >= 0) {
                return this;
            }

            this.topic2cbs[topic].push(cb);

            // check lateTopics
            // save it for late pub, at everysub to this topic
            //
            if (topic in this.lateTopics) {
                for (i = 0, l = this.lateTopics[topic].length; i < l; i++) {
                    cb.apply(null, [topic].concat(this.lateTopics[topic][i].args));
                }
            }
        },

        /**
         * removes an existing booked callback from the topic list
         * @param  {[type]}   topic [description]
         * @param  {Function} cb    [description]
         * @return {[type]}         [description]
         */
        unsub: function (topic, cb) {
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
            if (topic in this.lateTopics) {
                i = findInArray(this.lateTopics[topic], cb);
                i >= 0 && this.lateTopics[topic].splice(i, 1);
            }
            return this;
        },

        /**
         * one shot sub with auto unsub after first shot
         * @param  {[type]}   topic [description]
         * @param  {Function} cb    [description]
         * @return {[type]}         [description]
         */
        once: function (topic, cb) {
            var self = this;
            function cbTMP() {
                cb.apply(null, Array.prototype.slice.call(arguments, 0));
                self.unsub(topic, cbTMP);
            };
            this.sub(topic, cbTMP);
        },

        /**
         * Removes all callbacks for one or more topic
         * @param [String] ...
         *                 the topic queues that must  be emptied
         * @return [Channel] the instance
         */
        reset: function () {
            var ts = Array.prototype.slice.call(arguments, 0),
                l = ts.length,
                i = 0;
            if (!l) {
                this.topic2cbs = {};
                this.lateTopics = {};
                return this;
            }
            for (null; i < l; i += 1) {
                ts[i] in this.topic2cbs && (this.topic2cbs[ts[i]] = []);
                ts[i] in this.lateTopics && (this.lateTopics[ts[i]] = []);
            }
            return this;
        }
    };

    /**
     * returning function
     */
    return function (name) {
        if (!(name in channels)) {
            channels[name] = new _Channel();
        }
        return channels[name];
    };
})();