$NS$.dom = {
    remove: function (el) {
        var parent = el.parentNode;
        parent && parent.removeChild(el);
    }
};