FG.makeNS('FG/events');

FG.events.on = (function(W) {
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

FG.events.eventTarget = function(e) {
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

FG.events.kill = function(e) {
    if (!e) {
        e = W.event;
        e.cancelBubble = true;
        e.returnValue = false;
    }
    'stopPropagation' in e && e.stopPropagation() && e.preventDefault();
    return false;
};

FG.events.ready = (function () {
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

/* From Modernizr */
FG.events.transitionEnd = (function () {
    var n = document.createElement('fake'),
        k,
        trans = {
          'transition':'transitionend',
          'OTransition':'oTransitionEnd',
          'MozTransition':'transitionend',
          'WebkitTransition':'webkitTransitionEnd'
        };
    for(k in trans){
        if (n.style[k] !== undefined ){
            return trans[k];
        }
    }
})();