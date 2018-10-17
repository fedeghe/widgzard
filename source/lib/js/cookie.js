// type : LIB
// 
(function () {

    function initCheck() {
        return window.navigator.cookieEnabled;
    }

    function set(name, value, expires, path, domain, secure) {
        "use strict";
        if (!NS.cookie.enabled) return false;
        this.cookie_nocookiesaround = false;
        var today = new Date(),
            expires_date = new Date(today.getTime() + expires);
        // expires && (expires = expires * 1000 * 60 * 60 * 24);
        window.document.cookie = name +
            "=" + window.escape(value) +
            (expires ? ";expires=" + expires_date.toGMTString() : "") +
            (path ? ";path=" + path : "") +
            (domain ? ";domain=" + domain : "") +
            (secure ? ";secure" : "");
        return true;
    }

    function get(check_name) {
        "use strict";
        var a_all_cookies = window.document.cookie.split(';'),
            a_temp_cookie = '',
            cookie_name = '',
            cookie_value = '',
            b_cookie_found = false,
            i = 0,
            l = a_all_cookies.length;
        if (!NS.cookie.enabled) return false;
        for (null; i < l; i += 1) {
            a_temp_cookie = a_all_cookies[i].split('=');
            cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
            if (cookie_name === check_name) {
                b_cookie_found = true;
                a_temp_cookie.length > 1 && (cookie_value = window.unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, '')));
                return cookie_value;
            }
            a_temp_cookie = null;
            cookie_name = '';
        }
        return b_cookie_found;
    }

    function del(name, path, domain) {
        "use strict";
        if (!NS.cookie.enabled) return false;
        var ret = false;
        if (this.get(name)) {
            window.document.cookie = name + "=" + (path ? ";path=" + path : "") + (domain ? ";domain=" + domain : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
            ret = true;
        }
        return ret;
    }

	
    function delall() {
        "use strict";
        if (!NS.cookie.enabled) return false;
        var thecookie = window.document.cookie.split(";"),
            i = 0,
            l = thecookie.length,
            nome;
        for (null; i < l; i += 1) {
            nome = thecookie[i].split('=');
            this.del(nome[0], false, false);
        }
        this.cookie_nocookiesaround = true;
        return true;
    }

    function getall() {
        "use strict";
        if (!NS.cookie.enabled) return false;
        if (window.document.cookie === '') {
            return [];
        }
        return this.cookie_nocookiesaround ?
            []
            :
            window.document.cookie.split(';').forEach(
                function (i) {
                    var t = i.split('=');
                    return { name: t[0], value: t[1] };
                }
            );
    }

    NS.makeNs('cookie', {
        enabled: true,
        cookie_nocookiesaround: false,
        initCheck: initCheck,
        set: set,
        get: get,
        del: del,
        delall:  delall,
        getall: getall
    });
})();



