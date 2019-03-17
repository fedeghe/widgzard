// type : NS
//
(function () {
    'use strict';
    function initCheck () {
        return W.navigator.cookieEnabled;
    }

    function set (name, value, expires, copath, domain, secure) {
        if (!NS.cookie.enabled) return false;
        this.cookie_nocookiesaround = false;
        var today = new Date(),
            expiresDate = new Date(today.getTime() + expires);
        // expires && (expires = expires * 1000 * 60 * 60 * 24);
        WD.cookie = [
            name, '=', W.escape(value),
            (expires ? ';expires=' + expiresDate.toGMTString() : ''),
            (copath ? ';path=' + copath : ''),
            (domain ? ';domain=' + domain : ''),
            (secure ? ';secure' : '')
        ].join();
        return true;
    }

    function del (name, path, domain) {
        if (!NS.cookie.enabled) return false;
        var ret = false;

        if (this.get(name)) {
            WD.cookie = [
                name, '=',
                (path ? ';path=' + path : ''),
                (domain ? ';domain=' + domain : ''),
                ';expires=Thu, 01-Jan-1970 00:00:01 GMT'
            ].join('');
            ret = true;
        }
        return ret;
    }

    function get (checkName) {
        var allCookies = WD.cookie.split(';'),
            tempCookie = '',
            cookieName = '',
            cookieValue = '',
            cookieFound = false,
            i = 0,
            l = allCookies.length;

        if (!NS.cookie.enabled) return false;

        for (null; i < l; i += 1) {
            tempCookie = allCookies[i].split('=');
            cookieName = tempCookie[0].replace(/^\s+|\s+$/g, '');

            if (cookieName === checkName) {
                cookieFound = true;
                tempCookie.length > 1 && (cookieValue = W.unescape(tempCookie[1].replace(/^\s+|\s+$/g, '')));
                return cookieValue;
            }

            tempCookie = null;
            cookieName = '';
        }
        return cookieFound;
    }

    function delall () {
        if (!NS.cookie.enabled) return false;
        var thecookie = WD.cookie.split(/;/),
            i = 0,
            l = thecookie.length,
            nome;
        for (null; i < l; i += 1) {
            nome = thecookie[i].split(/=/);
            this.del(nome[0], false, false);
        }
        this.cookie_nocookiesaround = true;
        return true;
    }

    function getall () {
        if (!NS.cookie.enabled) return false;
        if (WD.cookie === '') {
            return [];
        }
        return this.cookie_nocookiesaround
            ? []
            : WD.cookie.split(';').forEach(
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
        delall: delall,
        getall: getall
    });
})();
