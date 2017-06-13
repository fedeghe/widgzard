$NS$.dom = {

	addClass : function (elem, addingClass) {
	    var cls = !!(elem.className) ? elem.className : '',
	    	reg = new RegExp('(\\s|^)' + addingClass + '(\\s|$)');
	    if (!cls.match(reg)) {
	        elem.className = addingClass + ' '+ cls;
	    }
	},

	removeClass : function (elem, removingClass) {
		var reg = new RegExp('(\\s|^)' + removingClass + '(\\s|$)');
	    elem.className = elem.className.replace(reg, ' ');
	},

	descendant : function () {
        var args = Array.prototype.slice.call(arguments, 0),
            i = 0,
            res = args.shift(),
            l = args.length;
        if (!l) return res;
        while (i < l) {
            res = res.children.item(~~args[i++]);
        }
        return res;
    },
    remove : function (el) {
    	var parent = el.parentNode;
        parent && parent.removeChild(el);
    }
};