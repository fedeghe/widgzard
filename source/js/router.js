(function () {
    "use strict";

    var routes = {};

    NS.history.registerRouteHandler(function (url, state, title) {
        url in routes && routes[url].cb(state || {});
        document.title = title || routes[url].title;
    });

    NS.makeNs('router', {
        add: function (url, cb, title) {
            routes[url] = {
                url: url,
                cb: function (state) {
                    cb.call(null, state)
                },
                title: title
            };
        },
        setup: function () {
            var a = [].slice.call(arguments, 0);
            a.forEach(function (route) {
                NS.router.add.apply(null, route);
            });
        }
    });
})();
