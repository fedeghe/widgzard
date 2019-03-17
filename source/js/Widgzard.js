/*
     ...    .     ...         .       ..                                                          ..
  .~`"888x.!**h.-``888h.     @88>   dF                                                          dF
 dX   `8888   :X   48888>    %8P   '88bu.                       ..                   .u    .   '88bu.
'888x  8888  X88.  '8888>     .    '*88888bu        uL        .@88i         u      .d88B :@8c  '*88888bu
'88888 8888X:8888:   )?""`  .@88u    ^"*8888N   .ue888Nc..   ""%888>     us888u.  ="8888f8888r   ^"*8888N
 `8888>8888 '88888>.88h.   ''888E`  beWE "888L d88E`"888E`     '88%   .@88 "8888"   4888>'88"   beWE "888L
   `8" 888f  `8888>X88888.   888E   888E  888E 888E  888E    ..dILr~` 9888  9888    4888> '     888E  888E
  -~` '8%"     88" `88888X   888E   888E  888E 888E  888E   '".-%88b  9888  9888    4888>       888E  888E
  .H888n.      XHn.  `*88!   888E   888E  888F 888E  888E    @  '888k 9888  9888   .d888L .+    888E  888F
 :88888888x..x88888X.  `!    888&  .888N..888  888& .888E   8F   8888 9888  9888   ^"8888*"    .888N..888
 f  ^%888888% `*88888nx"     R888"  `"888*""   *888" 888&  '8    8888 "888*""888"     "Y"       `"888*""
      `"**"`    `"**""        ""       ""       `"   "888E '8    888F  ^Y"   ^Y'                   ""
                                               .dWi   `88E  %k  <88F
                                               4888~  J8%    "+:*%`
                                                ^"===*"`
*/
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
