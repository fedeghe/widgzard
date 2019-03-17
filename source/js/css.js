NS.makeNs('css', {
    style: function (el, prop, val) {
        var propIsObj = typeof prop === 'object'
                          && typeof val === _U_,
            ret = false,
            k;

        if (propIsObj) {
            for (k in prop) el.style[k] = prop[k];
        } else {
            if (typeof val === _U_) {
                ret = el.currentStyle ? el.currentStyle[prop] : el.style[prop];
                return ret;
            } else {
                val += '';
                el.style[prop] = val;
                if (prop === 'opacity') {
                    el.style.filter = 'alpha(opacity = ' + ~~(100 * parseFloat(val, 10));
                }
            }
        }
    }
});
