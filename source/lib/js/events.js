$NS$.makeNs('$NS$/events');

(function () {

    var _ = {
        events : {
            wwdb_bindings : {},
            getElementDeterminant : function (el) {
                var tname = el.tagName;
                return (tname.match(/input|textarea/i)) ? 'value' : 'innerHTML';
            }
        }
    };

    $NS$.events.on = (function(W) {
        var fn;

        if ('addEventListener' in W) {
            fn = function(el, evnt, cb) {
                el.addEventListener.apply(el, [evnt, cb, false]);
            };
        } else if ('attachEvent' in W) {
            fn = function(el, evnt, cb) {
                el.attachEvent.apply(el, ['on' + evnt, cb]);
            };
        } else {
            fn = function() {
                throw new Error('No straight way to bind an event');
            };
        }
        return fn;
    })(this);

    $NS$.events.eventTarget = function(e) {
        e = e ? e : window.event;
        var targetElement = e.currentTarget || (typeof e.target !== 'undefined') ? e.target : e.srcElement;
        if (!targetElement) {
            return false;
        }
        while (targetElement.nodeType === 3 && targetElement.parentNode !== null) {
            targetElement = targetElement.parentNode;
        }
        return targetElement;
    };

    $NS$.events.kill = function(e) {
        if (!e) {
            e = W.event;
            e.cancelBubble = true;
            e.returnValue = false;
        }
        'stopPropagation' in e && e.stopPropagation() && e.preventDefault();
        return false;
    };

    $NS$.events.ready = (function () {
        var cb = [],
            readyStateCheckInterval = setInterval(function() {
                if (document.readyState === "complete") {
                    clearInterval(readyStateCheckInterval);
                    for (var i = 0, l = cb.length; i < l; i++) {
                        cb[i].call(this);
                    }
                }
            }, 10);
        return function (c) {
            if (document.readyState === "complete") {
                c.call(this);
            } else {
                cb.push(c);
            }
        };
    })();

    /**
     * my 2 way databinding
     */
    $NS$.events.ww = {
        on : function (obj, field,  el, debugobj) {
            var objLock = false,
                elLock = false,
                elDet = _.events.getElementDeterminant(el),
                elOldVal = el[elDet],
                objOldVal = obj[field],
                lock = function(m) {
                    objLock = elLock = !!m;
                };

            el.wwdbID = "_" + $NS$.util.uniqueid;

            // obj
            // when object changes -> element changes
            // 
            _.events.wwdb_bindings[el.wwdbID] = window.setInterval(function () {
                if (objLock) return;
                lock(true);
                if (objOldVal != obj[field]) {
                    elOldVal = obj[field];
                    objOldVal = elOldVal;
                    el[elDet] = elOldVal;
                }
                lock(false);
            }, 25);
            
            // input
            //
            $NS$.events.on(el, 'keyup', function () {
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
        off : function () {
            var els = [].slice.call(arguments, 0),
                l = els.length;
            while (l-- > 0) {
                $NS$.events.off(els[l], 'keyup');
                window.clearInterval(_.events.wwdb_bindings[els[l].wwdbID]);    
            }
        }
    };
})();