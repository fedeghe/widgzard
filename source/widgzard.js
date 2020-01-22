/* eslint-disable */
(function (_U_, _P_) {
    'use strict';
    console.log('\n\nWIDGZARD v.$PACKAGE.version$\n\n');
    var NS = {},
        W = window,
        WD = W.document,
        _context_ = W;
    
    /* ------------ */
    /* EXTERNAL begin */
    $$js/core.js$$
    $$js/utils.js$$
    $$js/_balle.js$$
    $$js/_searchhash.js$$
    $$js/_store.js$$
    /* EXTERNAL end */
    /* ------------ */

    $$js/history.js$$
    $$js/events.js$$
    $$js/_channel.js$$
    $$js/object.js$$
    $$js/css.js$$
    $$js/dom.js$$
    $$js/cookie.js$$
    $$js/i18n.js$$
    $$js/io.js$$
    $$js/timer.js$$
    $$js/wnode.js$$
    $$js/Widgzard.js$$
    $$js/Engy.js$$

    return {
        Widgzard: {
            render: NS.Widgzard.render,
            cleanup: NS.Widgzard.cleanup,
            load: NS.Widgzard.load,
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
        },
        Engy: {
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
        }
    };
})('undefined', 'prototype');
/* eslint-enable */
