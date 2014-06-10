FG.makeNS('FG/events');

FG.events.bind = (function(W) {
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