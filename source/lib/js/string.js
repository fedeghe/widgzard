// -----------------+
// STRING sub-module |
// -----------------+

// public section
$NS$.string = {
    /**
     * [ description]
     * @param  {Array[int]} code [description]
     * @return {[type]}      [description]
     */
    code2str : function (code) {
        return String.fromCharCode.apply(null, code);
    },


    
    /**
     * [multireplace description]
     * @param  {[type]} cnt [description]
     * @param  {[type]} o   [description]
     * @return {[type]}     [description]
     */
    multireplace : function (cnt, o) {
        for (var i in o) {
            cnt = cnt.replace(o[i], i);
        }
        return cnt;
    },

    /**
     * [regEscape description]
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     *
     * http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
     */
    regEscape : function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    },
    /**
     * [ description]
     * @param  {[type]} str [description]
     * @param  {[type]} n   [description]
     * @return {[type]}     [description]
     */
    repeat : function (str, n) {
        return new Array(n + 1).join(str);
    },
    /** 
     * [ description]
     * @param  {string} tpl      the template
     * @param  {literal or function} a literal for substitution or a function that will
     *                               return the substitution given as parameter a string
     * @param  {string} start       optional- the opening placeholder delimitator (%)
     * @param  {string} end       optional- the closing placeholder delimitator (%)
     * @param  {string} fallback optional- a fallback value in case an element is not found
     * @return {string}          the resulting string with replaced values
     *
     * this allows
    var tpl = 'a%x%g',
       o = {
           x : 'b%y%f',
           y:'c%z%e',
           z : 'd'
       };
    $NS$.string.replaceAll(tpl, o); // abcdefg
     * 
     */
    replaceAll : function (tpl, obj, options) {

        var start = '%',
            end = '%',
            fb = null,
            clean = false,
            reg,
            straight = true,
            str, tmp, last;

        if (undefined != options) {
            if ('delim' in options) {
                start = options.delim[0];
                end = options.delim[1];
            }
            if ('fb' in options) {
                fb = options.fb;
            }
            clean = !!options.clean;
        }

        reg = new RegExp(start + '(\\\+)?([A-z0-9-_\.]*)' + end, 'g');

        while (straight) {
            if (!(tpl.match(reg))) {
                return tpl;
            }
            tpl = tpl.replace(reg, function (str, enc, $1, _t) {
                
                if (typeof obj === 'function') {
                    /**
                     * avoid silly infiloops */
                    tmp = obj($1);
                    _t = (tmp !== start + $1 + end) ? obj($1) : $1;

                } else if ($1 in obj) {

                    _t = typeof obj[$1];
                    if (_t === 'function') {
                        _t = obj[$1]($1);
                    } else if (_t === 'object') {
                        _t = '';
                    } else {
                        _t= obj[$1];
                    }
                    // incomplete when the placeholder points to a object (would print)
                    // _t = typeof obj[$1] === 'function' ? obj[$1]($1) : obj[$1];
                    
                /**
                 * not a function and not found in literal
                 * use fallback if passed or get back the placeholder
                 * switching off before returning
                 */
                } else {
                    /* @ least check for ns, in case of dots
                    */
                    if ($1.match(/\./)) {
                        last = $NS$.checkNS($1 ,obj);
                        if (last) {
                            _t = enc ? encodeURIComponent(last) : last;
                            return typeof last === 'function' ? last($1) : last;
                        }
                    }
                    // but do not go deeper   
                    straight = false;
                    _t = fb !== null ? fb : clean ? '' : start + $1 + end;
                }
                return enc ? encodeURIComponent(_t): _t;
            });
        }
        return tpl;
    },
    //
    //
    //
    
    /**
     * [ description]
     * @param  {[type]} str [description]
     * @param  {[type]} pwd [description]
     * @return {[type]}     [description]
     */
    str2code : function (str) {
        var out = [],
            i = 0,
            l = str.length;
        while (i < l) {
            out.push(str.charCodeAt(i));
            i += 1;
        }
        return out;
    },

    /**
     * [str2hex description]
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    str2hex : function (str) {
        
        var out = [],
            i = 0,
            l = str.length;
        while (i < l) {
            out.push(
                '\\X' + 
                parseInt(str.charCodeAt(i), 10).toString(16).toUpperCase()
            );
            i += 1;
        }
        return "" + out.join('').replace(/X/g, "x");
    },

    /**
     * [ description]
     * @param  {[type]} s){return s.replace(/^\s+|\s+$/g [description]
     * @param  {[type]} ''         [description]
     * @return {[type]}            [description]
     */
    trim : function (s) {return s.replace(/^\s+|\s+$/g, ''); },

    /**
     * [ description]
     * @param  {[type]} s){return s.replace(/^\s+/g [description]
     * @param  {[type]} ''         [description]
     * @return {[type]}            [description]
     */
    triml : function (s) {return s.replace(/^\s+/g, ''); },

    /**
     * [ description]
     * @param  {[type]} s){return s.replace(/\s+$/g [description]
     * @param  {[type]} ''         [description]
     * @return {[type]}            [description]
     */
    trimr : function (s) {return s.replace(/\s+$/g, ''); },

    /**
     * [ucFirst description]
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    ucFirst : function (str) {
        return str.replace(/^\w/, function (chr) {return chr.toUpperCase(); });
    }
    
};

//-----------------------------------------------------------------------------