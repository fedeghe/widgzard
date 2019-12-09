NS.makeNs('i18n', function () {
    'use strict';

    var data = {};

    NS.lang = 'en';

    return {
        check: function (lab) {
            // return lab.match(/i18n\(([^)|]*)?\|?([^)|]*)\|?([^)]*)?\)/); 3???
            return lab.match(/i18n\(([^}|]*)?\|?([^}]*)\)/);
        },

        dynamicLoad: function (lo, _label) {
            for (_label in lo) {
                NS.lang in lo[_label] && (data[_label] = lo[_label][NS.lang]);
            }
        },

        get: function (k, fallback) {
            var maybe = NS.checkNs(k, data);
            // return data[k] || fallback || 'no Value';
            return maybe || fallback || 'no Value';
            // return maybe || fallback || false;
        },

        load: function (dict) {
            data = dict;
        },

        parse: function (obj) {
            var replacing = NS.SearchHash.forValue(obj, /i18n\(([^}|]*)?\|?([^}]*)\)/).results,
                mayP, ref, i, l;

            for (i = 0, l = replacing.length; i < l; i++) {
                if ((typeof replacing[i].regexp).match(/boolean/i)) continue;

                mayP = NS.i18n.check(replacing[i].regexp[0]);

                if (mayP) {
                    ref = NS.checkNs(replacing[i].container, obj);
                    // ref[replacing[i].key] = mayP;
                    ref[replacing[i].key] = NS.i18n.get(mayP[1], mayP[2]);
                }
            }
        }
    };
});
