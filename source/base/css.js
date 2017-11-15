$NS$.css = {
    style : function (el, prop, val) {

        var prop_is_obj = (typeof prop === 'object' && typeof val === 'undefined'),
            ret = false,
            newval, k;

        if (!prop_is_obj && typeof val === 'undefined') {

            ret = el.currentStyle ? el.currentStyle[prop] : el.style[prop];
            return ret;
        }

        if (prop_is_obj) {

            for (k in prop) {
                el.style[k] = prop[k];
            }
        } else if (typeof val !== 'undefined') {
            val += '';

            el.style[prop] = val;

            if (prop === 'opacity') {
                el.style.filter = 'alpha(opacity = ' + (~~(100 * parseFloat(val, 10))) + ')';
            }

        }
    }
};