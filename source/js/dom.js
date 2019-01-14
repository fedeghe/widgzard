NS.makeNs('dom', {
    remove: function (el) {
        return el.parentNode && el.parentNode.removeChild(el);
    }
});
