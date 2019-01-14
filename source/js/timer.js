+function () {
    'use strict';
    var time = 0;
    NS.makeNs('timer', {
        add: function(t) {
            time += t;
        },
        get: function() {
            var tmp = time + 0;
            time = 0;
            return tmp;
        }
    });
}();
