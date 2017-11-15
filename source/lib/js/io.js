$NS$.makeNs("$NS$/io");
$NS$.io = (function (){
    "use strict";
    var W = window,
        xdr = typeof W.XDomainRequest !== "undefined" && document.all && !(navigator.userAgent.match(/opera/i)),
        _ = {
            /**
             * Façade for getting the xhr object
             * @return {object} the xhr
             */
            getxhr : function (o) {
                var xhr,
                    IEfuckIds = ["Msxml2.XMLHTTP", "Msxml3.XMLHTTP", "Microsoft.XMLHTTP"],
                    len = IEfuckIds.length,
                    i = 0;

                if (xdr && o.cors) {
                    xhr = new W.XDomainRequest();
                } else {
                    try {
                        xhr = new W.XMLHttpRequest();
                    } catch (e1) {
                        for (null; i < len; i += 1) {
                            try {
                                xhr = new W.ActiveXObject(IEfuckIds[i]);
                            } catch (e2) {continue; }
                        }
                        !xhr && alert("No way to initialize XHR");
                    }
                }
                return xhr;
            },

            setHeaders : function (xhr, type) {
                var tmp = {
                    xml : "text/xml",
                    html : "text/html",
                    json : "application/json"
                }[type] || "text/html";
                xhr.setRequestHeader("Accept", tmp + "; charset=utf-8");
            },

            setMultipartHeader : function (xhr) {
                xhr.setRequestHeader("Content-Type","multipart/form-data");
            },

            setCookiesHeaders : function (xhr) {
                var cookies, i, l;
                cookies = $NS$.cookie.getall();
                i = 0, l = cookies.length;
                while (i < l) {
                    xhr.setRequestHeader("Cookie", cookies[i].name + "=" + cookies[i].value);
                    i++;
                }
            },

            ajcall : function (uri, options) {
                var xhr = _.getxhr(options),
                    method = (options && options.method) || "POST",
                    cback = options && options.cback,
                    cb_opened = (options && options.opened) || function () {},
                    cb_loading = (options && options.loading) || function () {},
                    cb_error = (options && options.error) || function () {},
                    cb_abort = (options && options.abort) || function () {},
                    sync = options && options.sync,
                    data = (options && options.data) || {},
                    type = (options && options.type) || "text/html",
                    cache = (options && options.cache !== undefined) ? options.cache : true,
                    targetType = type === "xml" ?  "responseXML" : "responseText",
                    timeout = options && options.timeout || 10000,
                    hasFiles = options && options.hasFiles,
                    formData,
                    complete = false,
                    res = false,
                    ret = false,
                    state = false,
                    tmp,
                    i, l;

                //prepare data, caring of cache
                //
                if (!cache) {

                    data.C = +new Date;
                }
                
                if (method === 'GET') {

                    data = $NS$.object.toQs(data).substr(1);

                } else {
                    // wrap data into a FromData object
                    // 
                    formData = new FormData();
                    for (tmp in data) {
                        formData.append(tmp , data[tmp]);
                    }
                    data = formData;
                }

                if (xdr && options.cors) {
                    // xhr is actually a xdr
                    xhr.open(method, (method === 'GET') ? (uri + ((data) ? '?' + data: '')) : uri);

                    xhr.onerror = cb_error;
                    xhr.ontimeout = function () {};
                    xhr.onprogress = function (e) {
                        if (e.lengthComputable) {
                            var percentComplete = (e.loaded / e.total) * 100;
                            console.log(percentComplete + '% uploaded');
                        }
                    };
                    xhr.onload = function (r) {
                        // cback((targetType === 'responseXML') ? r.target[targetType].childNodes[0] : r.target[targetType]);
                        cback(xhr.responseText);
                    };
                    xhr.timeout = 3000;

                    _.setHeaders(xhr, hasFiles, type);

                    var tmp = {
                        xml : 'text/xml',
                        html : 'text/html',
                        json : 'application/json'
                    }[type] || 'text/html';

                    xhr.contentType = tmp;
                    window.setTimeout(function () {
                        xhr.send();    
                    }, 20);
                    


                } else {
                    xhr.onreadystatechange = function () {
                        
                        if (state === xhr.readyState) {
                            
                            return false;
                        }
                        state = xhr.readyState;


                        // 404
                        //
                        if (~~xhr.readyState === 4 && ~~xhr.status === 0) {
                            xhr.onerror({error : 404, xhr : xhr, url : uri});
                            xhr.abort();
                            return false;
                        }
                        
                        if (state === 'complete' || (~~state === 4 && ~~xhr.status === 200)) {
                            complete = true;
                            
                            if(~~xhr.status === 404) {
                                xhr.onerror.call(xhr);
                                return false;
                            }


                            if (cback) {
                                res = xhr[targetType];
                                (function () {cback(res); })(res);
                            }
                            ret = xhr[targetType];

                            // IE leak ?????
                            W.setTimeout(function () {
                                xhr = null;
                            }, 50);
                            return ret;
                        } else if (state === 3) {
                            // loading data
                            //
                            cb_loading(xhr);
                        } else if (state === 2) {
                            // headers received
                            //
                            cb_opened(xhr);
                        } else if (state === 1) {
                            // only if no file upload is required
                            // add the header
                            // 
                            if (!hasFiles) {
                                _.setHeaders(xhr, type);
                                // NOOOOOOO
                                // _.setCookiesHeaders(xhr);
                            } else {
                                _.setHeaders(xhr, 'json');
                                // NO HEADERS AT ALL!!!!!!
                                // othewise no up
                                //                                
                                // _.setMultipartHeader(xhr);
                            }
                            switch (method) {
                                case 'POST':
                                case 'PUT':
                                    try {
                                        xhr.send(data || true);
                                    } catch (e1) {}
                                    break;
                                case 'GET':
                                    try {
                                        xhr.send(null);
                                    } catch (e2) {}
                                    break;
                                default :
                                    alert(method);
                                    xhr.send(null);
                                    break;
                            }
                        }
                        return true;
                    } ;

                    // error
                    // 
                    xhr.onerror = function () {
                        cb_error && cb_error.apply(null, arguments);
                    };

                    // abort
                    // 
                    xhr.onabort = function () {
                        cb_abort && cb_abort.apply(null, arguments);
                    };

                    // open request
                    //
                    xhr.open(method, method === "GET" ? uri + (data ? "?" + data: "") : uri, sync);

                    // thread abortion
                    //
                    W.setTimeout(function () {
                        if (!complete) {
                            complete = true;
                            xhr.abort();
                        }
                    }, timeout);
                    try {
                        return (targetType === "responseXML") ? xhr[targetType].childNodes[0] : xhr[targetType];
                    } catch (e3) {}
                }
                return true;
            }
        };


    // returning module
    // 
    return {
        getxhr : _.getxhr,
        post : function (uri, cback, sync, data, cache, files, err) {
            return _.ajcall(uri, {
                cback : function (r) {
                    if (files) {
                        r = r.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '');
                        cback( (window.JSON && window.JSON.parse) ? JSON.parse(r) : eval('(' + r + ')') );
                    } else {
                        cback(r);
                    }
                },
                method: 'POST',
                sync : sync,
                data : data,
                cache : cache,
                error: err,
                hasFiles : !!files
            });
        },
        get : function (uri, cback, sync, data, cache, err) {
            return _.ajcall(uri, {
                cback : cback || function () {},
                method : 'GET',
                sync : sync,
                data : data,
                cache : cache,
                error : err
            });
        },
        put : function (uri, cback, sync, data, cache, err) {
            return _.ajcall(uri, {
                cback : cback,
                method : 'PUT',
                sync : sync,
                data : data,
                cache : cache,
                error: err
            });
        },
        getJson : function (uri, cback, data, cors) {
            return _.ajcall(uri, {
                type : 'json',
                method: 'GET',
                sync : false,
                cback : function (r) {
                    // just to allow inline comments on json (not valid in json)
                    // cleanup comments
                    r = r.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '');
                    cback( (W.JSON && W.JSON.parse) ? JSON.parse(r) : eval('(' + r + ')') );
                },
                data : data,
                cors : !!cors
            });
        },
        getXML : function (uri, cback) {
            return _.ajcall(uri, {
                method : 'GET',
                sync : false,
                type : 'xml',
                cback : cback || function () {}
            });
        }
    };
})();
//-----------------------------------------------------------------------------