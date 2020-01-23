(function () {
    'use strict';

    var __renders = {};

    function render (conf, clean, name) {
        var timeStart = +new Date(),
            timeEnd,
            fragment = document.createDocumentFragment(),
            finalTarget = (function () { return conf.target || document.body; })(),
            originalHTML = finalTarget.innerHTML,
            rootNode,
            map = {
                abort: function () {
                    active = false;
                    finalTarget.innerHTML = originalHTML;
                    'onAbort' in conf
                        && (typeof conf.onAbort).match(/function/i)
                        && conf.onAbort.call(null, conf);
                    return false;
                },
                add: function (id, inst) { map.map[id] = inst; },
                endFunctions: [],
                getNode: function (id) { return map.map[id] || false; },
                getNodes: function () { return map.map; },
                lateWid: function (wid) { map.map[wid] = this; },
                map: {}
            },
            active = true;

        conf.target = fragment;
        finalTarget.cleanable && finalTarget.node.cleanup();

        if (clean === true) {
            finalTarget.innerHTML = '';
        }

        function done () {
            if (!active) {
                return;
            }
            conf.route
                && typeof conf.route === 'string'
                && NS.history.push(conf.route);

            conf.title
                && typeof conf.title === 'string'
                && (document.title = conf.title);

            finalTarget.appendChild(fragment);
            finalTarget.cleanable = true;

            timeEnd = +new Date();

            NS.timer.add(timeEnd - timeStart);

            // ending functions
            while (map.endFunctions.length) map.endFunctions.pop()();
        }

        rootNode = new Wnode(conf, done, map, null);
        finalTarget.node = rootNode;
        map.rootNode = rootNode;
        rootNode.setMap(map);
        rootNode.cleanable = true;
        rootNode.render();

        if (name && !(name in __renders)) __renders[name] = rootNode;
        return rootNode;
    }

    function cleanup (trg, msg) {
        render({ target: trg, content: [{ html: msg || '' }] }, true);
    }

    function get (params) {
        var r = document.createElement('div'),
            wnode;
        params.target = r;
        wnode = render(params);
        return [r, wnode];
    }

    function loadStealth (src) {
        var s = document.createElement('script');
        document.getElementsByTagName('head')[0].appendChild(s);

        // when finished remove the script tag
        s.onload = function () {
            s.parentNode.removeChild(s);
        };
        s.src = src;
    }

    function getElement (n) {
        return n in __renders ? __renders[n] : false;
    }

    function getElements () {
        return __renders;
    }

    NS.makeNs('Widgzard', {
        render: render,
        cleanup: cleanup,
        get: get,
        load: loadStealth,
        getElement: getElement,
        getElements: getElements
    });
})();
