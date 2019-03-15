(function(W, _U_, _P_) {
    "use strict";

    console.log("\n\n WIDGZARD v.$VERSION.WIDGZARD$\n\n");
    var NS = {},
        WD = W.document;
    
    $$js/core.js$$
    $$js/balle.js$$
    $$js/history.js$$
    $$js/events.js$$
    $$js/channel.js$$
    $$js/object.js$$
    $$js/css.js$$
    $$js/dom.js$$
    $$js/cookie.js$$
    $$js/i18n.js$$
    $$js/io.js$$
    $$js/store.js$$
    $$js/timer.js$$

    $$js/wnode.js$$

    $$js/Widgzard.js$$
    $$js/Engy.js$$
    W.Widgzard = {
        render: NS.Widgzard.render,
        cleanup: NS.Widgzard.cleanup,
        load: NS.Widgzard.loadStealth,
        get: NS.Widgzard.get,
        getElement: NS.Widgzard.getElement,
        getElements: NS.Widgzard.getElements,

        getStore: NS.getStore,
        Channel: NS.Channel,
        events: NS.events,
        cookie: NS.cookie,
        utils: NS.utils,
        i18n: NS.i18n,
        io: NS.io,
        object: NS.object,
        css: NS.css,
        dom: NS.dom,
        timer: NS.timer,
        history: NS.history
    };

    W.Engy = {
        component: NS.Engy.component,
        components: NS.Engy.components,
        configSet: NS.Engy.configSet,
        define: NS.Engy.define,
        get: NS.Engy.get,
        load: NS.Engy.loadStealth,
        getElement: NS.Engy.getElement,
        getElements: NS.Engy.getElements,
        process: NS.Engy.process,
        render: NS.Engy.render,
        timer: NS.timer,
        history: NS.history
    };

})(this, 'undefined', 'prototype');
