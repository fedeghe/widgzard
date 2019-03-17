(function () {
    'use strict';
    var _ = {
        events: {
            wwdb_bindings: {},
            getElementDeterminant: function (el) {
                var tname = el.tagName;
                return (tname.match(/input|textarea|select/i)) ? 'value' : 'innerHTML';
            },
            getElementEvent: function (el) {
                var tname = el.tagName;
                return (tname.match(/input|textarea/i)) ? 'input' : 'change';
            }
        },
        unhandlers: {}
    };

    NS.makeNs('events', {
        saveUnhandler: function (el, f) {
            _.unhandlers[el] = _.unhandlers[el] || [];
            _.unhandlers[el].push(f);
        },
        unhandle: function (el) {
            _.unhandlers[el] && _.unhandlers[el].forEach(function (unhandler) {
                unhandler();
            });
            _.unhandlers = [];
        },
        on: (function () {
            function unhandle (el, evnt, cb) {
                NS.events.saveUnhandler(el, function () {
                    NS.events.off(el, evnt, cb);
                });
            }
            if ('addEventListener' in W) {
                return function (el, evnt, cb) {
                    el.addEventListener.apply(el, [evnt, cb, false]);
                    unhandle(el, evnt, cb);
                };
            } else if ('attachEvent' in W) {
                return function (el, evnt, cb) {
                    el.attachEvent.apply(el, ['on' + evnt, cb]);
                    unhandle(el, evnt, cb);
                };
            } else {
                return function () {
                    throw new Error('No straight way to bind an event');
                };
            }
        })(),
        off: (function () {
            if ('removeEventListener' in W) {
                return function (el, evnt, cb) {
                    el.removeEventListener(evnt, cb);
                };
            } else if ('detachEvent' in W) {
                return function (el, evnt, cb) {
                    el.detachEvent.apply(el, ['on' + evnt, cb]);
                };
            } else {
                return function () {
                    throw new Error('No straight way to unbind an event');
                };
            }
        })(),

        kill: function (e) {
            if (!e) {
                e = W.event;
                e.cancelBubble = true;
                e.returnValue = false;
            }
            'stopPropagation' in e && e.stopPropagation() && e.preventDefault();
            return false;
        },

        eventTarget: function (e) {
            e = e || W.event;
            var targetElement = e.currentTarget || (typeof e.target !== _U_) ? e.target : e.srcElement;
            if (!targetElement) {
                return false;
            }
            while (targetElement.nodeType === 3 && targetElement.parentNode !== null) {
                targetElement = targetElement.parentNode;
            }
            return targetElement;
        },

        ready: (function () {
            var cb = [],
                i,
                l,
                readyStateCheckInterval = setInterval(function () {
                    if (document.readyState === 'complete') {
                        clearInterval(readyStateCheckInterval);
                        for (i = 0, l = cb.length; i < l; i++) {
                            cb[i].call(this);
                        }
                    }
                }, 10);
            return function (c) {
                if (document.readyState === 'complete') {
                    c.call(this);
                } else {
                    cb.push(c);
                }
            };
        })(),

        ww: {
            on: function (obj, field, el, debugobj) {
                var objLock = false,
                    elLock = false,
                    elDet = _.events.getElementDeterminant(el),
                    elEvent = _.events.getElementEvent(el),
                    elOldVal = el[elDet],
                    objOldVal = obj[field],
                    lock = function (m) {
                        objLock = elLock = !!m;
                    };

                el.wwdbID = '_' + NS.utils.uniqueid;

                // obj
                // when object changes -> element changes
                //
                _.events.wwdb_bindings[el.wwdbID] = W.setInterval(function () {
                    if (objLock) return;
                    lock(true);
                    if (objOldVal !== obj[field]) {
                        elOldVal = obj[field];
                        objOldVal = elOldVal;
                        el[elDet] = elOldVal;
                    }
                    lock(false);
                }, 25);

                // input
                //
                NS.events.on(el, elEvent, function () {
                    if (elLock) return;
                    lock(true);
                    if (this[elDet] !== obj[field]) {
                        obj[field] = this[elDet];
                        elOldVal = this[elDet];
                        objOldVal = this[elDet];
                    }
                    lock(false);
                });
                el[elDet] = objOldVal;
            },
            off: function () {
                var els = [].slice.call(arguments, 0),
                    l = els.length;
                while (l-- > 0) {
                    NS.events.off(els[l], 'keyup');
                    W.clearInterval(_.events.wwdb_bindings[els[l].wwdbID]);
                }
            }
        }
    });
})();
