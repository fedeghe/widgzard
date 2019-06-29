/*

     ...    .     ...         .       ..                                                          ..
  .~`"888x.!**h.-``888h.     @88>   dF                                                          dF
 dX   `8888   :X   48888>    %8P   '88bu.                       ..                   .u    .   '88bu.
'888x  8888  X88.  '8888>     .    '*88888bu        uL        .@88i         u      .d88B :@8c  '*88888bu
'88888 8888X:8888:   )?""`  .@88u    ^"*8888N   .ue888Nc..   ""%888>     us888u.  ="8888f8888r   ^"*8888N
 `8888>8888 '88888>.88h.   ''888E`  beWE "888L d88E`"888E`     '88%   .@88 "8888"   4888>'88"   beWE "888L
   `8" 888f  `8888>X88888.   888E   888E  888E 888E  888E    ..dILr~` 9888  9888    4888> '     888E  888E
  -~` '8%"     88" `88888X   888E   888E  888E 888E  888E   '".-%88b  9888  9888    4888>       888E  888E
  .H888n.      XHn.  `*88!   888E   888E  888F 888E  888E    @  '888k 9888  9888   .d888L .+    888E  888F
 :88888888x..x88888X.  `!    888&  .888N..888  888& .888E   8F   8888 9888  9888   ^"8888*"    .888N..888
 f  ^%888888% `*88888nx"     R888"  `"888*""   *888" 888&  '8    8888 "888*""888"     "Y"       `"888*""
      `"**"`    `"**""        ""       ""       `"   "888E '8    888F  ^Y"   ^Y'                   ""
                                               .dWi   `88E  %k  <88F
                                               4888~  J8%    "+:*%`
                                                ^"===*"`
Author: Federico Ghedina <fedeghe@gmail.com>
Version: 3.1.15
Size: ~104KB
*/
/* eslint-disable */
Widgzard = null;
Engy = null;
(function () {
    'use strict';
    (function () {
        var t =
        /*
        [Malta] widgzard.js
        */
        /* eslint-disable */
        (function (_U_, _P_) {
            'use strict';
            console.log('\n\nWIDGZARD v.3.1.15\n\n');
            var NS = {},
                W = window,
                WD = W.document,
                _context_ = W;
            /*
            [Malta] js/core.js
            */
            /* eslint-disable no-console */
            /**
             * Autoexecuted closure that allows to create namespaces,
             * the autocall is used to put the function itself in a namespace
             *
             */
            (function () {
                // this is due, to test all implications see
                // http://www.jmvc.org/test_strict?ga=false
                // (the ga=false params inhibits google analytics tracking)
                'use strict';
            
                var allowLog = true,
                    allowDebug = true,
                    _AP_ = Array.prototype;
            
                /**
                 * Creates a namespace
                 * @param  {String} str     dot or slash separated path for the namespace
                 * @param  {Object literal} [{}]obj optional: the object to be inserted in the ns, or a function that returns the desired object
                 * @param  {[type]} ctx     [window] the context object where the namespace will be created
                 * @return {[type]}         the brand new ns
                 *
                 * @hint This method is DESTRUCTIVE if the obj param is passed,
                 *       a conservative version is straight-forward
                 * @sample
                 *     makens('SM', {hello: ...});
                 *     makens('SM', {hi: ...}); // now hello exists no more
                 *
                 *     //use
                 *     makens('SM', {hello: ..., hi: })
                 *     // or if in different files
                 *     // file1
                 *     makens('SM')
                 *     SM.hello = ...
                 *     //
                 *     // file2
                 *     makens('SM')
                 *     SM.hi = ...
                 *
                 *     makens('SM/proto', function () {
                 *
                 *          // some private stuff
                 *          //
                 *
                 *          return {
                 *              foo0 : function () {...},
                 *              foo1 : function () {...}
                 *          }
                 *     })
                 *
                 */
                function makens (str, obj, ctx) {
                    str = str.replace(/^\//, '');
                    var els = str.split(/\.|\//),
                        l = els.length,
                        ret;
            
                    // default context window
                    //
                    (typeof ctx === _U_) && (ctx = NS);
            
                    // default object empty
                    //
                    (typeof obj === _U_) && (obj = {});
            
                    // if function
                    //
                    (typeof obj === 'function') && (obj = obj());
            
                    //
                    if (!ctx[els[0]]) {
                        ctx[els[0]] = (l === 1) ? obj : {};
                    }
                    ret = ctx[els[0]];
                    return (l > 1) ? makens(els.slice(1).join('.'), obj, ctx[els[0]]) : ret;
                }
            
                function checkns (ns, ctx) {
                    // remove stating slash
                    ns = ns.replace(/^\//, '');
            
                    // get all elements splitting by . or /
                    var els = ns.split(/\.|\//),
                        i = 0,
                        l = els.length;
                    ctx = (typeof ctx !== _U_) ? ctx : _context_;
            
                    if (!ns) {
                        return ctx;
                    }
            
                    for (null; i < l; i += 1) {
                        if (typeof ctx[els[i]] !== _U_) {
                            ctx = ctx[els[i]];
                        } else {
                            // break it
                            return undefined;
                        }
                    }
                    return ctx;
                }
            
                function extendns (ns, objfn) {
                    var i,
                        obj = typeof objfn === 'function' ? objfn() : objfn;
                    for (i in obj) {
                        if (typeof ns[i] === _U_) {
                            ns[i] = obj[i];
                        }
                    }
                }
            
                // use makens to publish itself and something more
                //
                NS.makeNs = makens;
                NS.checkNs = checkns;
                NS.extendNs = extendns;
                NS.debug = function () {
                    var args = _AP_.prototype.slice.call(arguments, 0);
                    allowDebug && 'debug' in console && console.debug.apply(console, args);
                };
                NS.log = function () {
                    var args = _AP_.prototype.slice.call(arguments, 0);
                    allowLog && 'log' in console && console.log.apply(console, args);
                };
            
                NS.dbg = function (m) {
                    // maybe shut up
                    if (!allowDebug) { return void 0; }
                    try {
                        console.log(m);
                    } catch (e1) {
                        try {
                            // eslint-disable-next-line no-undef
                            W.opera.postError(m);
                        } catch (e2) {
                            W.alert(m);
                        }
                    }
                };
            
                // use it again to define a function to get
                // uniqueid
                NS.makeNs('utils', {
                    /**
                     * useful to get a unique id string
                     * @return {String} the wanted id
                     */
                    /* eslint-disable */
                    uniqueId: new function () {
                        var count = 0,
                            self = this;
                        this.prefix = 'NS_';
                        this.toString = function () {
                            count += 1;
                            return self.prefix + count;
                        };
                    },
                    /* eslint-enable */
                    eulerWalk: function (root, func, mode) {
                        mode = { pre: 'pre', post: 'post' }[mode] || 'post';
                        var nope = function () { },
                            pre = mode === 'pre' ? func : nope,
                            post = mode === 'post' ? func : nope;
            
                        (function walk (n_, _n) {
                            pre(n_);
                            _n = n_.firstChild;
                            while (_n) {
                                walk(_n);
                                _n = _n.nextSibling;
                            }
                            post(n_);
                        })(root);
                    },
                    replaceDataInTxt: function (str, data) {
                        return str.replace(/\$([A-z]*)\$/g, function (str, $1) {
                            var out = $1.replace(/\$/g, '');
                            return (out in data) ? data[out] : '';
                        });
                    },
                    toMemFormat: function (size, post) {
                        'use strict';
                        if (!size) return size + (post || '');
                        var div = 2 << 9,
                            units = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
                            index = 0;
                        while (size / Math.pow(div, index + 1) > 1) {
                            index++;
                        }
                        return [
                            (size / Math.pow(div, index)).toFixed(2).replace(/\.?0+$/, ''),
                            units[index],
                            post || ''
                        ].join('');
                    },
                    getViewportSize: function () {
                        var WDE = WD.documentElement;
                        if (typeof W.innerWidth !== _U_) {
                            return {
                                width: W.innerWidth,
                                height: W.innerHeight
                            };
                        } else {
                            if (typeof WDE !== _U_
                                && typeof WDE.clientWidth !== _U_
                                && WDE.clientWidth !== 0
                            ) {
                                return {
                                    width: WDE.clientWidth,
                                    height: WDE.clientHeight
                                };
                            } else {
                                return {
                                    width: WD.getElementsByTagName('body')[0].clientWidth,
                                    height: WD.getElementsByTagName('body')[0].clientHeight
                                };
                            }
                        }
                    },
                    // isMobile: (function () {
                    //     var ua = navigator.userAgent || navigator.vendor || W.opera;
                    //     return /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|playbook|silk/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
                    // })(),
                    isMobile: function () {
                        return (typeof W.matchMedia !== _U_ || typeof W.msMatchMedia !== _U_)
                            && W.matchMedia('(pointer:coarse)').matches;
                    }
                });
            })();
            
            /*
            [Malta] js/balle.js
            */
            /* eslint-disable */
            
            (function (){
                'use strict';
                /*
                [Malta] ../node_modules/balle/dist/index.js
                */
                /*
                _____ _____ __    __    _____
                | __  |  _  |  |  |  |  |   __|
                | __ -|     |  |__|  |__|   __|
                |_____|__|__|_____|_____|_____|
                                                v. 1.0.37
                Author: federico.ghedina@gmail.com
                Size: ~2KB
                
                */
                function Balle(e){var l=this,t=!1;this.status=Balle.STATUSES.PENDING,this.value=null,this.cause=null,this.resolvers=this.resolvers||[],this.rejectors=this.rejectors||[],
                this.finalizers=this.finalizers||[],e=e||function(){};try{e(function(e){t||l.status!==Balle.STATUSES.PENDING||(t=!0,l.status=Balle.STATUSES.FULFILLED,l.value=e,Balle.roll(l.resolvers,"value",l),
                Balle.roll(l.finalizers,"value",l))},function(e){t||l.status!==Balle.STATUSES.PENDING||(t=!0,l.status=Balle.STATUSES.REJECTED,l.cause=e,Balle.roll(l.rejectors,"cause",l),
                Balle.roll(l.finalizers,"cause",l))})}catch(e){return Balle.reject(e.message)}return this}Balle.roll=function(e,l,t){e.forEach(function(e){e(t[l])},t)},Balle.prototype.resolve=function(e){
                return Balle.call(this,function(l,t){return l(e)})},Balle.prototype.reject=function(e){return Balle.call(this,function(l,t){return t(e)})},Balle.prototype.launch=function(e){return Balle.call(this,e)
                },Balle.prototype.then=function(e,l){switch(this.status){case Balle.STATUSES.REJECTED:Balle.roll(this.rejectors,"cause",this);break;case Balle.STATUSES.PENDING:this.resolvers.push(e),
                l&&this.rejectors.push(l);break;case Balle.STATUSES.FULFILLED:e(this.value)}return this},Balle.prototype.catch=function(e){switch(this.status){case Balle.STATUSES.PENDING:this.rejectors.push(e);break
                ;case Balle.STATUSES.REJECTED:return e.call(this,this.cause)}return this},Balle.prototype.finally=function(e){return this.finalizers.push(e),
                this.status!==Balle.STATUSES.PENDING&&Balle.roll(this.finalizers,"value",this),this},Balle.STATUSES={PENDING:"PENDING",FULFILLED:"FULFILLED",REJECTED:"REJECTED"},Balle._isFunc=function(e){
                return"function"==typeof e},Balle._isIterable=function(e){return null!=e&&Balle._isFunc(e[Symbol.iterator])},Balle.one=function(e){return new Balle(e)},Balle.all=function(e){
                if(!Balle._isIterable(e))return Balle.reject("Balle.all acceps an Iterable Promise only");var l=[],t=e.length,a=0;return new Balle(function(n,r){e.forEach(function(e,s){
                "REJECTED"==e.status&&r(e.cause),e.then(function(e){a++,l[s]=e,a==t&&n(l)}).catch(r)})})},Balle.race=function(e){return Balle._isIterable(e)?new Balle(function(l,t){e.forEach(function(e){
                e.then(l).catch(t)})}):Balle.reject("Balle.race acceps an Iterable Promise only")},Balle.chain=function(e){if(!Balle._isIterable(e))return Balle.reject("Balle.chain acceps an Iterable Promise only")
                ;var l=e.length;return new Balle(function(t,a){!function n(r,s){return r===l?t(s):e[r](s).then(function(e){n(++r,e)}).catch(function(e){a(e)})}(0)})},Balle.reject=function(e){
                return new Balle(function(l,t){return t(e)})},Balle.resolve=function(e){return new Balle(function(l,t){e instanceof Balle?e.then(l).catch(t):l(e)})},"object"==typeof exports&&(module.exports=Balle);
                NS.Balle = Balle;
            })();
            
            /* eslint-enable */
            /*
            [Malta] js/history.js
            */
            (function () {
                'use strict';
                var H = W.history,
                    handlers = [],
                    spread = function (url, state, title) {
                        handlers.forEach(function (handler) {
                            handler(url, state, title);
                        });
                    };
                NS.makeNs('history', {
                    push: function (url, state, title) {
                        H.pushState(state || {}, title || '', url);
                        spread(url, state, title);
                    },
                    registerHandler: function (f) {
                        handlers.push(f);
                    },
                    replace: function (url, state, title) {
                        H.replaceState(state || {}, title || '', url);
                        spread(url, state, title);
                    },
                    resetHandlers: function () {
                        handlers = [];
                    },
                    state: function () {
                        return H.state;
                    }
                });
            })();
            
            /*
            [Malta] js/events.js
            */
            (function () {
                'use strict';
                var _ = {
                    events: {
                        wwdb_bindings: {},
                        getElementDeterminant: function (el) {
                            var tname = el.tagName;
                            return (tname.match(/input|textarea|select/i)) ? 'value' : 'innerHTML';
                        },
                        getElementEvent: function (el) {
                            var tname = el.tagName;
                            return (tname.match(/input|textarea/i)) ? 'input' : 'change';
                        }
                    },
                    unhandlers: {}
                };
            
                NS.makeNs('events', {
                    saveUnhandler: function (el, f) {
                        _.unhandlers[el] = _.unhandlers[el] || [];
                        _.unhandlers[el].push(f);
                    },
                    unhandle: function (el) {
                        _.unhandlers[el] && _.unhandlers[el].forEach(function (unhandler) {
                            unhandler();
                        });
                        _.unhandlers = [];
                    },
                    on: (function () {
                        function unhandle (el, evnt, cb) {
                            NS.events.saveUnhandler(el, function () {
                                NS.events.off(el, evnt, cb);
                            });
                        }
                        if ('addEventListener' in W) {
                            return function (el, evnt, cb) {
                                el.addEventListener.apply(el, [evnt, cb, false]);
                                unhandle(el, evnt, cb);
                            };
                        } else if ('attachEvent' in W) {
                            return function (el, evnt, cb) {
                                el.attachEvent.apply(el, ['on' + evnt, cb]);
                                unhandle(el, evnt, cb);
                            };
                        } else {
                            return function () {
                                throw new Error('No straight way to bind an event');
                            };
                        }
                    })(),
                    off: (function () {
                        if ('removeEventListener' in W) {
                            return function (el, evnt, cb) {
                                el.removeEventListener(evnt, cb);
                            };
                        } else if ('detachEvent' in W) {
                            return function (el, evnt, cb) {
                                el.detachEvent.apply(el, ['on' + evnt, cb]);
                            };
                        } else {
                            return function () {
                                throw new Error('No straight way to unbind an event');
                            };
                        }
                    })(),
            
                    kill: function (e) {
                        if (!e) {
                            e = W.event;
                            e.cancelBubble = true;
                            e.returnValue = false;
                        }
                        'stopPropagation' in e && e.stopPropagation() && e.preventDefault();
                        return false;
                    },
            
                    eventTarget: function (e) {
                        e = e || W.event;
                        var targetElement = e.currentTarget || (typeof e.target !== _U_) ? e.target : e.srcElement;
                        if (!targetElement) {
                            return false;
                        }
                        while (targetElement.nodeType === 3 && targetElement.parentNode !== null) {
                            targetElement = targetElement.parentNode;
                        }
                        return targetElement;
                    },
            
                    ready: (function () {
                        var cb = [],
                            i,
                            l,
                            readyStateCheckInterval = setInterval(function () {
                                if (document.readyState === 'complete') {
                                    clearInterval(readyStateCheckInterval);
                                    for (i = 0, l = cb.length; i < l; i++) {
                                        cb[i].call(this);
                                    }
                                }
                            }, 10);
                        return function (c) {
                            if (document.readyState === 'complete') {
                                c.call(this);
                            } else {
                                cb.push(c);
                            }
                        };
                    })(),
            
                    ww: {
                        on: function (obj, field, el, debugobj) {
                            var objLock = false,
                                elLock = false,
                                elDet = _.events.getElementDeterminant(el),
                                elEvent = _.events.getElementEvent(el),
                                elOldVal = el[elDet],
                                objOldVal = obj[field],
                                lock = function (m) {
                                    objLock = elLock = !!m;
                                };
            
                            el.wwdbID = '_' + NS.utils.uniqueid;
            
                            // obj
                            // when object changes -> element changes
                            //
                            _.events.wwdb_bindings[el.wwdbID] = W.setInterval(function () {
                                if (objLock) return;
                                lock(true);
                                if (objOldVal !== obj[field]) {
                                    elOldVal = obj[field];
                                    objOldVal = elOldVal;
                                    el[elDet] = elOldVal;
                                }
                                lock(false);
                            }, 25);
            
                            // input
                            //
                            NS.events.on(el, elEvent, function () {
                                if (elLock) return;
                                lock(true);
                                if (this[elDet] !== obj[field]) {
                                    obj[field] = this[elDet];
                                    elOldVal = this[elDet];
                                    objOldVal = this[elDet];
                                }
                                lock(false);
                            });
                            el[elDet] = objOldVal;
                        },
                        off: function () {
                            var els = [].slice.call(arguments, 0),
                                l = els.length;
                            while (l-- > 0) {
                                NS.events.off(els[l], 'keyup');
                                W.clearInterval(_.events.wwdb_bindings[els[l].wwdbID]);
                            }
                        }
                    }
                });
            })();
            
            /*
            [Malta] js/channel.js
            */
            /* eslint-disable */
            
            (function () {
                'use strict';
                /*
                [Malta] ../node_modules/@fedeghe/channeljs/dist/index.js
                */
                /*
                
                C H A N N E L J S
                
                Date: 15/3/2019
                Size: ~1KB
                Author: Federico Ghedina <federico.ghedina@gmail.com>
                */
                var Channeljs=function(){"use strict";var t={},i=function(t,i){return t.indexOf(i)},s=function(){this.topic2cbs={},this.lateTopics={},this.enabled=!0},e=function(t,i){var s=t.enabled
                ;return t.enabled=i,s!==t.enabled},n=s.prototype;return n.enable=function(){return e(this,!0)},n.disable=function(){return e(this,!1)},n.pub=function(t,i){var s,e=0,n=[]
                ;if(i instanceof Array||(i=[i]),!(t in this.topic2cbs&&this.enabled))return t in this.lateTopics?this.lateTopics[t].push({args:i}):this.lateTopics[t]=[{args:i}],null
                ;for(s=this.topic2cbs[t].length;e<s;e+=1)n.push(this.topic2cbs[t][e].apply(null,i));return n},n.sub=function(t,i,s){var e,n=0,c=[];if(t in this.topic2cbs&&this.enabled||(this.topic2cbs[t]=[]),
                this.topic2cbs[t].push(i),s&&t in this.lateTopics){for(n=0,e=this.lateTopics[t].length;n<e;n++)c.push(i.apply(null,this.lateTopics[t][n].args));return c}},n.unsub=function(t,s){var e=0
                ;return t in this.topic2cbs&&(e=i(this.topic2cbs[t],s))>=0&&this.topic2cbs[t].splice(e,1)&&0===this.topic2cbs[t].length&&delete this.topic2cbs[t],t in this.lateTopics&&delete this.lateTopics[t],this},
                n.once=function(t,i,s){function e(){return n.unsub(t,e),i.apply(null,Array.prototype.slice.call(arguments,0))}var n=this;return this.sub(t,e,s)},n.reset=function(){
                var t=Array.prototype.slice.call(arguments,0),i=t.length,s=0;if(!i)return this.topic2cbs={},this.lateTopics={},this;for(null;s<i;s+=1)t[s]in this.topic2cbs&&delete this.topic2cbs[t[s]],
                t[s]in this.lateTopics&&delete this.lateTopics[t[s]];return this},{getChannels:function(i){var s,e={};if("boolean"==typeof i)for(s in t)t[s].enabled===i&&(e[s]=t[s]);else e=t;return e},
                get:function(i){return i in t||(t[i]=new s),t[i]}}}();"object"==typeof exports&&(module.exports=Channeljs);
                NS.Channel = Channeljs;
            })();
            
            /* eslint-enable */
            /*
            [Malta] js/object.js
            */
            (function () {
                'use strict';
            
                /**
                 * maps an object literal to a string according using the map function  passed
                 * @param  {Literal}   o  the object literal
                 * @param  {Function} fn  the map function
                 * @return {String}       the resulting string
                 */
                function strMap (o, fn) {
                    var ret = '',
                        j;
                    for (j in o) {
                        if (o.hasOwnProperty(j)) {
                            ret += fn(o, j, ret);
                        }
                    }
                    return ret;
                }
            
                function jCompare (obj1, obj2) {
                    // avoid tags
                    return !isNode(obj1)
                    && typeof JSON !== _U_
                        ? JSON.stringify(obj1) === JSON.stringify(obj2)
                        : obj1 === obj2;
                }
            
                // Returns true if it is a DOM node
                //
                function isNode (o) {
                    return (
                        typeof Node === 'object'
                            ? o instanceof W.Node
                            : o
                                && typeof o === 'object'
                                && typeof o.nodeType === 'number'
                                && typeof o.nodeName === 'string'
                    );
                }
            
                // Returns true if it is a DOM element
                //
                function isElement (o) {
                    return (
                        typeof HTMLElement === 'object'
                            ? o instanceof W.HTMLElement
                            : o
                                && typeof o === 'object'
                                && o !== null && o.nodeType === 1
                                && typeof o.nodeName === 'string'
                    );
                }
            
                function digFor (what, obj, target, limit) {
                    if (!what.match(/key|value|keyvalue/)) {
                        throw new Error('Bad param for object.digFor');
                    }
                    limit = parseInt(limit, 10);
            
                    var found = 0,
                        matches = {
                            key: function (k1, k2, key) {
                                return (NS.object.isString(k1) && key instanceof RegExp)
                                    ? k1.match(key)
                                    : jCompare(k1, key);
                            },
                            value: function (k1, k2, val) {
                                var v = (NS.object.isString(k2) && val instanceof RegExp)
                                    ? k2.match(val)
                                    : jCompare(k2, val);
            
                                return v;
                            },
                            keyvalue: function (k1, k2, keyval) {
                                return (
                                    (NS.object.isString(k1) && keyval.key instanceof RegExp)
                                        ? k1.match(keyval.key)
                                        : jCompare(k1, keyval.key)
                                ) && (
                                    (NS.object.isString(k2) && keyval.value instanceof RegExp)
                                        ? k2.match(keyval.value)
                                        : jCompare(k2, keyval.value)
                                );
                            }
                        }[what],
                        res = [],
                        maybeDoPush = function (path, index, key, obj, level) {
                            var p = [].concat.call(path, [index]),
                                tmp = matches(index, obj[index], key);
            
                            if (tmp) {
                                res.push({
                                    obj: obj,
                                    value: obj[index],
                                    key: p[p.length - 1],
                                    parentKey: p[p.length - 2],
                                    path: p.join('/'),
                                    container: p.slice(0, p.length - 1).join('/'),
                                    parentContainer: p.slice(0, p.length - 2).join('/'),
                                    regexp: tmp,
                                    level: level
                                });
                                found++;
                            }
                            dig(obj[index], key, p, level + 1);
                        },
                        // eslint-disable-next-line complexity
                        dig = function (o, k, path, level) {
                            // if is a domnode must be avoided
                            if (isNode(o) || isElement(o)) {
                                return;
                            }
            
                            var i, l;
            
                            if (o instanceof Array) {
                                for (i = 0, l = o.length; i < l; i++) {
                                    maybeDoPush(path, i, k, o, level);
                                    if (limit && limit === found) {
                                        break;
                                    }
                                }
                            } else if (typeof o === 'object') {
                                for (i in o) {
                                    maybeDoPush(path, i, k, o, level);
                                    if (limit && limit === found) {
                                        break;
                                    }
                                }
                            }
                        };
                    dig(obj, target, [], 0);
                    return res;
                }
            
                /**
                 * returning module
                 */
                NS.makeNs('object', {
                    fromQs: function () {
                        var els = document.location.search.substr(1).split('&'),
                            i, len, tmp, out = [];
            
                        for (i = 0, len = els.length; i < len; i += 1) {
                            tmp = els[i].split('=');
            
                            // do not override extra path out
                            //
                            !out[tmp[0]] && (out[tmp[0]] = decodeURIComponent(tmp[1]));
                        }
                        return out;
                    },
            
                    clone: function (obj) {
                        var self = NS.object,
                            copy,
                            i, l;
                        // Handle the 3 simple types, and null or undefined
                        if (obj === null || typeof obj !== 'object') {
                            return obj;
                        }
            
                        // Handle Date
                        if (obj instanceof Date) {
                            copy = new Date();
                            copy.setTime(obj.getTime());
                            return copy;
                        }
            
                        // Handle Array
                        if (obj instanceof Array) {
                            copy = [];
                            for (i = 0, l = obj.length; i < l; i++) {
                                copy[i] = self.clone(obj[i]);
                            }
                            return copy;
                        }
            
                        // Handle Object
                        if (obj instanceof Object) {
                            copy = {};
                            for (i in obj) {
                                if (obj.hasOwnProperty(i)) {
                                    copy[i] = self.clone(obj[i]);
                                }
                            }
                            return copy;
                        }
                        throw new Error('Unable to copy obj! Its type isn\'t supported.');
                    },
            
                    /**
                     * { function_description }
                     *
                     * @param      {<type>}  o       { parameter_description }
                     * @param      {<type>}  k       { parameter_description }
                     * @param      {<type>}  lim     The limit
                     * @return     {<type>}  { description_of_the_return_value }
                     */
                    digForKey: function (o, k, lim) {
                        return digFor('key', o, k, lim);
                    },
            
                    /**
                     * [digForValues description]
                     * @param  {[type]} o [description]
                     * @param  {[type]} k [description]
                     * @return {[type]}   [description]
                     */
                    digForValue: function (o, k, lim) {
                        return digFor('value', o, k, lim);
                    },
            
                    /**
                     * { function_description }
                     *
                     * @param      {<type>}  o       { parameter_description }
                     * @param      {<type>}  kv      { parameter_description }
                     * @param      {<type>}  lim     The limit
                     * @return     {<type>}  { description_of_the_return_value }
                     */
                    digForKeyValue: function (o, kv, lim) {
                        return digFor('keyvalue', o, kv, lim);
                    },
            
                    extend: function (o, ext, force) {
                        var obj = NS.object.clone(o),
                            j;
                        for (j in ext) {
                            if (ext.hasOwnProperty(j) && (!(j in obj) || force)) {
                                obj[j] = ext[j];
                            }
                        }
                        return obj;
                    },
            
                    keyize: function (objArr, k) {
                        var objRet = {},
                            i = 0,
                            l = objArr.length;
                        for (null; i < l; i++) {
                            if (k in objArr[i] && !(objArr[i][k] in objRet)) {
                                objRet[objArr[i][k]] = objArr[i];
                            }
                        }
                        return objRet;
                    },
            
                    isString: function (o) {
                        return typeof o === 'string' || o instanceof String;
                    },
            
                    jCompare: jCompare,
            
                    /**
                     * uses strMap private function to map an onject literal to a querystring ready for url
                     * @param  {Literal} obj    the object literal
                     * @return {String}         the mapped object
                     */
                    toQs: function (obj) {
                        return strMap(obj, function (o, i, r) {
                            return ([
                                r ? '&' : '?',
                                encodeURIComponent(i),
                                '=',
                                encodeURIComponent(o[i])
                            ].join('')).replace(/'/g, '%27');
                        });
                    }
                });
            })();
            
            /*
            [Malta] js/css.js
            */
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
            
            /*
            [Malta] js/dom.js
            */
            NS.makeNs('dom', {
                remove: function (el) {
                    return el.parentNode && el.parentNode.removeChild(el);
                }
            });
            
            /*
            [Malta] js/cookie.js
            */
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
            
            /*
            [Malta] js/i18n.js
            */
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
                        var replacing = NS.object.digForValue(obj, /i18n\(([^}|]*)?\|?([^}]*)\)/),
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
            
            /*
            [Malta] js/io.js
            */
            /* eslint-disable no-console */
            (function () {
                'use strict';
            
                var W = window,
                    xdr = typeof W.XDomainRequest !== 'undefined' && document.all && !(navigator.userAgent.match(/opera/i)),
                    _ = {
                        /**
                         * Façade for getting the xhr object
                         * @return {object} the xhr
                         */
                        getxhr: function (o) {
                            var xhr,
                                IEfuckIds = ['Msxml2.XMLHTTP', 'Msxml3.XMLHTTP', 'Microsoft.XMLHTTP'],
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
                                        } catch (e2) { continue; }
                                    }
                                    !xhr && W.alert('No way to initialize XHR');
                                }
                            }
                            return xhr;
                        },
            
                        setHeaders: function (xhr, type) {
                            var tmp = {
                                xml: 'text/xml',
                                html: 'text/html',
                                json: 'application/json'
                            }[type] || 'text/html';
                            xhr.setRequestHeader('Accept', tmp + 'charset=utf-8');
                        },
            
                        setMultipartHeader: function (xhr) {
                            xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                        },
            
                        setCookiesHeaders: function (xhr) {
                            var cookies, i, l;
                            cookies = NS.cookie.getall();
                            i = 0;
                            l = cookies.length;
                            while (i < l) {
                                xhr.setRequestHeader('Cookie', cookies[i].name + '=' + cookies[i].value);
                                i++;
                            }
                        },
            
                        // eslint-disable-next-line complexity
                        ajcall: function (uri, options) {
                            var xhr = _.getxhr(options),
                                method = (options && options.method) || 'POST',
                                cback = options && options.cback,
                                cbOpened = (options && options.opened) || function () { },
                                cbLoading = (options && options.loading) || function () { },
                                cbError = (options && options.error) || function () { },
                                cbabort = (options && options.abort) || function () { },
                                sync = options && options.sync,
                                data = (options && options.data) || {},
                                type = (options && options.type) || 'text/html',
                                cache = (options && options.cache !== undefined) ? options.cache : true,
                                targetType = type === 'xml' ? 'responseXML' : 'responseText',
                                timeout = (options && options.timeout) || 10000,
                                hasFiles = options && options.hasFiles,
                                formData,
                                complete = false,
                                res = false,
                                ret = false,
                                state = false,
                                tmp;
            
                            // prepare data, caring of cache
                            //
                            if (!cache) {
                                data.C = +new Date();
                            }
            
                            if (method === 'GET') {
                                data = NS.object.toQs(data).substr(1);
                            } else {
                                // wrap data into a FromData object
                                //
                                formData = new W.FormData();
                                for (tmp in data) {
                                    if (data.hasOwnProperty(tmp)) {
                                        formData.append(tmp, data[tmp]);
                                    }
                                }
                                data = formData;
                            }
            
                            if (xdr && options.cors) {
                                // xhr is actually a xdr
                                xhr.open(method, (method === 'GET') ? (uri + ((data) ? ('?' + data) : '')) : uri);
            
                                xhr.onerror = cbError;
                                xhr.ontimeout = function () { };
                                xhr.onprogress = function (e) {
                                    if (e.lengthComputable) {
                                        var percentComplete = (e.loaded / e.total) * 100;
                                        console.log(percentComplete + '% uploaded');
                                    }
                                };
                                xhr.onload = function (/* r */) {
                                    // cback((targetType === 'responseXML') ? r.target[targetType].childNodes[0] : r.target[targetType]);
                                    cback(xhr.responseText);
                                };
                                xhr.timeout = 3000;
            
                                _.setHeaders(xhr, hasFiles, type);
            
                                tmp = {
                                    xml: 'text/xml',
                                    html: 'text/html',
                                    json: 'application/json'
                                }[type] || 'text/html';
            
                                xhr.contentType = tmp;
                                window.setTimeout(function () {
                                    xhr.send();
                                }, 20);
                            } else {
                                // eslint-disable-next-line complexity
                                xhr.onreadystatechange = function () {
                                    if (state === xhr.readyState) {
                                        return false;
                                    }
                                    state = xhr.readyState;
            
                                    // 404
                                    //
                                    if (parseInt(xhr.readyState, 10) === 4 && parseInt(xhr.status, 10) === 0) {
                                        xhr.onerror({ error: 404, xhr: xhr, url: uri });
                                        xhr.abort();
                                        return false;
                                    }
            
                                    if (state === 'complete' || (parseInt(state, 10) === 4 && parseInt(xhr.status, 10) === 200)) {
                                        complete = true;
            
                                        if (parseInt(xhr.status, 10) === 404) {
                                            xhr.onerror.call(xhr);
                                            return false;
                                        }
            
            
                                        if (cback) {
                                            res = xhr[targetType];
                                            (function () { cback(res); })(res);
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
                                        cbLoading(xhr);
                                    } else if (state === 2) {
                                        // headers received
                                        //
                                        cbOpened(xhr);
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
                                                } catch (e1) { }
                                                break;
                                            case 'DELETE':
                                            case 'GET':
                                                try {
                                                    xhr.send(null);
                                                } catch (e2) { }
                                                break;
                                            default:
                                                W.alert(method);
                                                xhr.send(null);
                                                break;
                                        }
                                    }
                                    return true;
                                };
            
                                // error
                                //
                                xhr.onerror = function () {
                                    cbError && cbError.apply(null, arguments);
                                };
            
                                // abort
                                //
                                xhr.onabort = function () {
                                    cbabort && cbabort.apply(null, arguments);
                                };
            
                                // open request
                                //
                                xhr.open(method, method === 'GET' ? uri + (data ? ('?' + data) : '') : uri, sync);
            
                                // thread abortion
                                //
                                W.setTimeout(function () {
                                    if (!complete) {
                                        complete = true;
                                        xhr.abort();
                                    }
                                }, timeout);
                                try {
                                    return (targetType === 'responseXML') ? xhr[targetType].childNodes[0] : xhr[targetType];
                                } catch (e3) { }
                            }
                            return true;
                        }
                    };
            
            
                // returning module
                //
                NS.makeNs('io', {
                    getxhr: _.getxhr,
                    post: function (uri, cback, sync, data, cache, files, err) {
                        return _.ajcall(uri, {
                            cback: function (r) {
                                if (files) {
                                    r = r.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '');
                                    cback((window.JSON && window.JSON.parse) ? JSON.parse(r) : eval(['(', r, ')'].join('')));
                                } else {
                                    cback(r);
                                }
                            },
                            method: 'POST',
                            sync: sync,
                            data: data,
                            cache: cache,
                            error: err,
                            hasFiles: !!files
                        });
                    },
                    get: function (uri, cback, sync, data, cache, err) {
                        return _.ajcall(uri, {
                            cback: cback || function () { },
                            method: 'GET',
                            sync: sync,
                            data: data,
                            cache: cache,
                            error: err
                        });
                    },
                    put: function (uri, cback, sync, data, cache, err) {
                        return _.ajcall(uri, {
                            cback: cback,
                            method: 'PUT',
                            sync: sync,
                            data: data,
                            cache: cache,
                            error: err
                        });
                    },
                    getJson: function (uri, cback, data, cors) {
                        return _.ajcall(uri, {
                            type: 'json',
                            method: 'GET',
                            sync: false,
                            cback: function (r) {
                                // just to allow inline comments on json (not valid in json)
                                // cleanup comments
                                r = r.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '');
                                cback((W.JSON && W.JSON.parse) ? JSON.parse(r) : eval(['(', r, ')'].join('')));
                            },
                            data: data,
                            cors: !!cors
                        });
                    },
                    getXML: function (uri, cback) {
                        return _.ajcall(uri, {
                            method: 'GET',
                            sync: false,
                            type: 'xml',
                            cback: cback || function () { }
                        });
                    }
                });
            })();
            
            /*
            [Malta] js/store.js
            */
            /* eslint-disable */
            
            (function () {
                'use strict';
                /*
                [Malta] ../node_modules/ridof/dist/index.js
                */
                /*
                           d8,      d8b            ,d8888b
                          `8P       88P            88P'
                                   d88          d888888P
                  88bd88b  88b d888888   d8888b   ?88'
                  88P'  `  88Pd8P' ?88  d8P' ?88  88P
                 d88      d88 88b  ,88b 88b  d88 d88
                d88'     d88' `?88P'`88b`?8888P'd88'
                
                                                      v. 1.1.5
                
                Size: ~2KB
                */
                var Ridof=function(){"use strict";function t(){return{}}function e(t,e){if("function"!=typeof t)throw new Error(e)}function n(t,e){if(void 0===t)throw new Error(e)}function r(t,e,n){
                var r=t.states[t.currentIndex];t.listeners.forEach(function(t){t(r,e,n)}),t.currentIndex<t.states.length-1&&(t.states=t.states.slice(0,t.currentIndex)),t.states[++t.currentIndex]=e}function s(n,r){
                this.reducer=n||t(),e(n,o.REDUCERS_FUCTION),this.state=void 0!==r?r:this.reducer(),this.states=[this.state],this.currentIndex=0,this.listeners=[]}function i(t){const e={};var n;for(n in t)e[n]=t[n]()
                ;return function(n,r,s){n=n||e;var i,o=Object.assign({},n);for(i in t)o[i]=t[i](o[i],r,s);return o}}const o={REDUCERS_FUCTION:"[ERROR] Reducer must be a function!",
                REDUCERS_RETURN:"[ERROR] Reducer should return something!",SUBSCRIBERS_FUNCTION:"[ERROR] Subscribers must be a functions!",ACTION_TYPE:"[ERROR] Actions needs a type"}
                ;return s.prototype.getState=function(){return this.states[this.currentIndex]},s.prototype.dispatch=function(t,e){if(!("type"in t))throw new Error(o.ACTION_TYPE)
                ;var s,i=t.type,u=this.states[this.currentIndex],c=this.reducer(u,i,t);if(n(c,o.REDUCERS_RETURN),delete c.type,e)for(s in t)"type"===s||s in c||(c[s]=t[s]);return r(this,c,i),this},
                s.prototype.subscribe=function(t){e(t,o.SUBSCRIBERS_FUNCTION);var n,r=this;return this.listeners.push(t),n=this.listeners.length-1,function(){
                r.listeners=r.listeners.slice(0,n).concat(r.listeners.slice(n+1))}},s.prototype.replaceReducer=function(t){e(t,o.REDUCERS_FUCTION),this.reducer=t},s.prototype.reset=function(){var t=this.states[0]
                ;this.states=[t],this.currentIndex=0,this.listeners=[]},s.prototype.move=function(t){if(0===t)return this
                ;var e=this,n=this.currentIndex+t,r=this.getState(),s=t>0?"FORWARD":"BACKWARD",i=n>-1&&n<this.states.length;return this.currentIndex=i?n:this.currentIndex,i&&this.listeners.forEach(function(t){
                t(r,e.getState(),{type:["TIMETRAVEL_",s].join("")})}),this},{combine:i,getStore:function(t,e){return new s(t,e)},isStore:function(t){return t instanceof s},ERRORS:o}}()
                ;"object"==typeof exports&&(module.exports=Ridof);
                NS.getStore = Ridof.getStore;
            })();
            
            /* eslint-enable */
            /*
            [Malta] js/timer.js
            */
            (function () {
                'use strict';
                var time = 0;
                NS.makeNs('timer', {
                    add: function (t) {
                        time += t;
                    },
                    get: function () {
                        var tmp = time + 0;
                        time = 0;
                        return tmp;
                    }
                });
            })();
            
            /*
            [Malta] js/wnode.js
            */
            /* eslint-disable no-console */
            /*
                 ...    .     ...                                   ..
              .~`"888x.!**h.-``888h.                              dF
             dX   `8888   :X   48888>     u.    u.          u.   '88bu.
            '888x  8888  X88.  '8888>   x@88k u@88c.  ...ue888b  '*88888bu        .u
            '88888 8888X:8888:   )?""` ^"8888""8888"  888R Y888r   ^"*8888N    ud8888.
             `8888>8888 '88888>.88h.     8888  888R   888R I888>  beWE "888L :888'8888.
               `8" 888f  `8888>X88888.   8888  888R   888R I888>  888E  888E d888 '88%"
              -~` '8%"     88" `88888X   8888  888R   888R I888>  888E  888E 8888.+"
              .H888n.      XHn.  `*88!   8888  888R  u8888cJ888   888E  888F 8888L
             :88888888x..x88888X.  `!   "*88*" 8888"  "*888*P"   .888N..888  '8888c. .+
             f  ^%888888% `*88888nx"      ""   'Y"      'Y"       `"888*""    "88888%
                  `"**"`    `"**""                                   ""         "YP'
            
             */
            function Wnode (conf, done, map, parent) {
                var self = this;
            
                this.id = '' + NS.utils.uniqueId;
                this.conf = conf;
                this.done = done;
                this.map = map;
                this.parent = parent;
                this.children = [];
                this.data = {};
                this.sub = {};
                this.attrs = {};
                this.style = {};
                this.tag = conf.tag || 'div';
            
                this.conf.style = this.conf.style || {};
                this.conf.attrs = this.conf.attrs || {};
                this.conf.data = this.conf.data || {};
                this.doRender = true;
            
                // from map
                this.root = map.rootNode;
                this.abort = map.abort;
                this.getNode = map.getNode;
                this.getNodes = map.getNodes;
                this.lateWid = map.lateWid;
            
                this.report = function () {
                    W.JSON && console.log([
                        'json size : ',
                        NS.utils.toMemFormat(JSON.stringify(self.conf).length, 'B')
                    ].join(''));
                    console.log([
                        'html size : ',
                        NS.utils.toMemFormat(self.node.innerHTML.length, 'B')
                    ].join(''));
                };
            
                this.events = {
                    onClick: true,
                    onMouseover: true,
                    onMouseout: true,
                    onMouseleave: true,
                    onDblclick: true,
                    onFocus: true,
                    onChange: true,
                    onInput: true,
                    onSelect: true,
                    onKeyup: true,
                    onKeydown: true,
                    onKeypress: true,
                    onSubmit: true,
                    onBlur: true
                };
            }
            
            Wnode.prototype.cleanup = function () {
                NS.events.unhandle(this.id);
                var node = this.node,
                    removeNode = function (t) {
                        t.parentNode.removeChild(t);
                        return true;
                    },
                    nodesToBeCleaned = [],
                    keys = ['cleanable', 'parent', 'getNode', 'climb', 'root', 'done', 'resolve', 'data'],
                    kL = keys.length,
                    i = 0, j = 0, k = 0,
                    n = null;
            
                // pick up postorder tree traversal
                NS.utils.eulerWalk(node, function (n) {
                    // skip root & text nodes
                    n !== node && n.nodeType !== 3 && nodesToBeCleaned.push(n) && k++;
                }, 'post');
            
                while (j < k) {
                    n = nodesToBeCleaned[j++];
                    while (i < kL) n[keys[i++]] = null;
                    removeNode(n);
                    n = null;
                }
            
                // now delete all Wnodes
                (function remWnode (wn) {
                    wn.children.forEach(remWnode);
                    wn = null;
                })(this);
            
                nodesToBeCleaned = [];
                keys = null;
                delete this.root;
                return true;
            };
            
            Wnode.prototype.setMap = function (map) {
                this.map = map;
                this.root = map.rootNode;
                this.abort = map.abort;
                this.getNode = map.getNode;
                this.getNodes = map.getNodes;
                this.lateWid = map.lateWid;
            };
            
            // eslint-disable-next-line complexity
            Wnode.prototype.render = function () {
                var self = this,
                    tmp, i, j, k,
                    __nodeIdentifier = 'wid',
                    replacementTempNode,
                    rerendering = this.node
                        && this.parent
                        && this.node.parentNode === this.parent.node;
            
                if (rerendering) {
                    replacementTempNode = document.createElement('div');
                    replacementTempNode.style.display = 'none';
                    this.conf.target.replaceChild(replacementTempNode, this.node);
                }
            
                typeof this.conf[__nodeIdentifier] !== _U_
                && this.map.add(this.conf[__nodeIdentifier], this);
            
                // do it now, so the content if function can consume it
                this.node = this.conf.ns
                    ? document.createElementNS(this.conf.ns, this.tag)
                    : document.createElement(this.tag);
                this.node.innerHTML = (this.conf.html && this.conf.data)
                    ? NS.utils.replaceDataInTxt('' + this.conf.html, this.conf.data)
                    : (this.conf.html || '');
            
                this.setData().setAttrs()
                    .setEvents().setStyle()
                    .setMethods()
                    .checkInit()
                    .checkWillRender();
            
                if (/* this.conf.content && */ typeof this.conf.content === 'function') {
                    this.conf.content = this.conf.content.call(this);
                }
            
                this.wlen = this.conf.content
                    ? this.conf.content.length
                    : 0;
            
                this.conf.cb = (this.doRender && this.conf.cb)
                    ? this.conf.cb.bind(this)
                    : self.done.bind(this);
            
                if (!this.doRender) {
                    this.conf.cb('---auto---');
                    return this;
                }
            
                if (typeof this.conf.text !== _U_) {
                    tmp = NS.utils.replaceDataInTxt('' + this.conf.text, this.conf.data);
                    tmp = document.createTextNode('' + tmp);
                    this.node.appendChild(tmp);
                }
            
                rerendering
                    ? this.conf.target.replaceChild(this.node, replacementTempNode)
                    : this.conf.target.appendChild(this.node);
            
                this.checkEnd();
            
                if (this.wlen === 0) {
                    this.conf.cb('---auto---');
                } else {
                    this.praramsFromChildren = [];
                    this.conf.content.forEach(function (conf) {
                        conf.target = self.node;
                        self.children.push((new Wnode(
                            conf,
                            function () {
                                self.praramsFromChildren.push([].slice.call(arguments, 0));
                                --self.wlen <= 0 && self.conf.cb.apply(self, self.praramsFromChildren);
                            },
                            self.map,
                            self
                        )).render());
                    });
                }
            
                /**
                 * ABSOLUTELY EXPERIMENTAL 2WDB
                 */
                tmp = this.node.getAttribute('wwdb');
                if (tmp) {
                    this.node.removeAttribute('wwdb');
                    i = NS.checkNs(tmp, this);
                    if (i !== undefined) {
                        j = ('this.' + tmp).split('.');
                        k = j.pop();
                        i = eval(j.join('.'));
                        k in i && NS.events.ww.on(i, k, this.node);
                    }
                }
                // 2WDB end
                this.cleanable = true;
                return this;
            };
            
            Wnode.prototype.checkWillRender = function () {
                'use strict';
                if ('willRender' in this.conf
                    && typeof this.conf.willRender === 'function'
                ) {
                    this.doRender = this.conf.willRender.call(this);
                }
                return this;
            };
            
            Wnode.prototype.subRender = function () {
                return Engy.render(this.sub);
            };
            
            Wnode.prototype.climb = function (n) {
                n = n || 1;
                var ret = this;
                while (n--) {
                    ret = ret.parent || ret;
                }
                return ret;
            };
            
            Wnode.prototype.descendant = function () {
                'use strict';
                var self = this,
                    args = Array.prototype.slice.call(arguments, 0),
                    i = 0,
                    res = self,
                    l = args.length;
                if (!l) return res;
                while (i < l) {
                    res = res.children[~~args[i++]];
                }
                return res;
            };
            
            Wnode.prototype.setAttrs = function () {
                var node = this.node,
                    tmp;
                if (typeof this.conf.attrs !== _U_) {
                    this.attrs = this.conf.attrs;
                    for (tmp in this.attrs) {
                        if (tmp !== 'class') {
                            if (tmp !== 'style') {
                                node.setAttribute(tmp, this.attrs[tmp]);
                            } else {
                                Wnode.prototype.setStyle.call(this);
                            }
                        } else {
                            node.className = this.attrs[tmp];
                        }
                    }
                }
                return this;
            };
            
            Wnode.prototype.setStyle = function () {
                var node = this.node,
                    tmp;
                if (typeof this.conf.style !== _U_) {
                    this.style = this.conf.style;
                    for (tmp in this.style) {
                        if (tmp === 'float') {
                            node.style[tmp.replace(/^float$/i, 'cssFloat')] = this.style[tmp];
                        } else {
                            node.style[tmp] = this.style[tmp];
                        }
                    }
                }
                return this;
            };
            
            Wnode.prototype.setMethods = function () {
                var self = this,
                    keys = Object.keys(this.conf),
                    tmp;
                keys.forEach(function (k) {
                    tmp = k.match(/^method_(\w*)$/i);
                    if (tmp) {
                        self[tmp[1]] = self.conf[tmp[0]].bind(self);
                    }
                });
                return this;
            };
            
            Wnode.prototype.setData = function () {
                'use strict';
                if (this.conf.data) this.data = this.conf.data || {};
                return this;
            };
            
            Wnode.prototype.checkInit = function () {
                'use strict';
                var keepRunning = true;
                if ('init' in this.conf && typeof this.conf.init === 'function') {
                    keepRunning = this.conf.init.call(this);
                    !keepRunning && this.abort();
                }
                return this;
            };
            
            Wnode.prototype.checkEnd = function () {
                'use strict';
                var self = this;
                'end' in this.conf
                && typeof this.conf.end === 'function'
                && this.map.endFunctions.push(function () {
                    self.conf.end.call(self);
                });
                return this;
            };
            
            Wnode.prototype.setEvents = function () {
                'use strict';
                var i,
                    self = this;
                for (i in this.events) {
                    (function (name) {
                        var j;
                        if (name in self.conf) {
                            j = name.match(/on(.*)/)[1].toLowerCase();
                            NS.events.on(self.node, j, function (e) {
                                self.conf[name].call(self, e);
                            });
                        }
                    })(i);
                };
                return this;
            };
            
            Wnode.prototype.report = function () {
                window.JSON && console.log('json size : ' + JSON.stringify(this.conf).length);
                console.log('html size : ' + this.root.node.innerHTML.length);
            };
            
            /*
            [Malta] js/Widgzard.js
            */
            /*
                 ...    .     ...         .       ..                                                          ..
              .~`"888x.!**h.-``888h.     @88>   dF                                                          dF
             dX   `8888   :X   48888>    %8P   '88bu.                       ..                   .u    .   '88bu.
            '888x  8888  X88.  '8888>     .    '*88888bu        uL        .@88i         u      .d88B :@8c  '*88888bu
            '88888 8888X:8888:   )?""`  .@88u    ^"*8888N   .ue888Nc..   ""%888>     us888u.  ="8888f8888r   ^"*8888N
             `8888>8888 '88888>.88h.   ''888E`  beWE "888L d88E`"888E`     '88%   .@88 "8888"   4888>'88"   beWE "888L
               `8" 888f  `8888>X88888.   888E   888E  888E 888E  888E    ..dILr~` 9888  9888    4888> '     888E  888E
              -~` '8%"     88" `88888X   888E   888E  888E 888E  888E   '".-%88b  9888  9888    4888>       888E  888E
              .H888n.      XHn.  `*88!   888E   888E  888F 888E  888E    @  '888k 9888  9888   .d888L .+    888E  888F
             :88888888x..x88888X.  `!    888&  .888N..888  888& .888E   8F   8888 9888  9888   ^"8888*"    .888N..888
             f  ^%888888% `*88888nx"     R888"  `"888*""   *888" 888&  '8    8888 "888*""888"     "Y"       `"888*""
                  `"**"`    `"**""        ""       ""       `"   "888E '8    888F  ^Y"   ^Y'                   ""
                                                           .dWi   `88E  %k  <88F
                                                           4888~  J8%    "+:*%`
                                                            ^"===*"`
            */
            (function () {
                'use strict';
            
                var __renders = {};
            
                function render (conf, clean, name) {
                    var timeStart = +new Date(),
                        timeEnd,
                        fragment = document.createDocumentFragment(),
                        finalTarget = (function () { return conf.target || document.body; })(),
                        originalHTML = finalTarget.innerHTML,
                        rootNode,
                        map = {
                            abort: function () {
                                active = false;
                                finalTarget.innerHTML = originalHTML;
                                'onAbort' in conf
                                    && (typeof conf.onAbort).match(/function/i)
                                    && conf.onAbort.call(null, conf);
                                return false;
                            },
                            add: function (id, inst) { map.map[id] = inst; },
                            endFunctions: [],
                            getNode: function (id) { return map.map[id] || false; },
                            getNodes: function () { return map.map; },
                            lateWid: function (wid) { map.map[wid] = this; },
                            map: {}
                        },
                        active = true;
            
                    conf.target = fragment;
                    finalTarget.cleanable && finalTarget.node.cleanup();
            
                    if (clean === true) {
                        finalTarget.innerHTML = '';
                    }
            
                    function done () {
                        if (!active) {
                            return;
                        }
                        conf.route
                            && typeof conf.route === 'string'
                            && NS.history.push(conf.route);
            
                        conf.title
                            && typeof conf.title === 'string'
                            && (document.title = conf.title);
            
                        finalTarget.appendChild(fragment);
                        finalTarget.cleanable = true;
            
                        timeEnd = +new Date();
            
                        NS.timer.add(timeEnd - timeStart);
            
                        // ending functions
                        while (map.endFunctions.length) map.endFunctions.pop()();
                    }
            
                    rootNode = new Wnode(conf, done, map, null);
                    finalTarget.node = rootNode;
                    map.rootNode = rootNode;
                    rootNode.setMap(map);
                    rootNode.cleanable = true;
                    rootNode.render();
            
                    if (name && !(name in __renders)) __renders[name] = rootNode;
                    return rootNode;
                }
            
                function cleanup (trg, msg) {
                    render({ target: trg, content: [{ html: msg || '' }] }, true);
                }
            
                function get (params) {
                    var r = document.createElement('div'),
                        wnode;
                    params.target = r;
                    wnode = render(params);
                    return [r, wnode];
                }
            
                function loadStealth (src) {
                    var s = document.createElement('script');
                    document.getElementsByTagName('head')[0].appendChild(s);
            
                    // when finished remove the script tag
                    s.onload = function () {
                        s.parentNode.removeChild(s);
                    };
                    s.src = src;
                }
            
                function getElement (n) {
                    return n in __renders ? __renders[n] : false;
                }
            
                function getElements () {
                    return __renders;
                }
            
                NS.makeNs('Widgzard', {
                    render: render,
                    cleanup: cleanup,
                    get: get,
                    load: loadStealth,
                    getElement: getElement,
                    getElements: getElements
                });
            })();
            
            /*
            [Malta] js/Engy.js
            */
            /* eslint-disable no-undef */
            /* eslint-disable no-console */
            /**
            
            
                      ..      .
                   x88f` `..x88. .>                             ..
                 :8888   xf`*8888%     u.    u.                @L
                :8888f .888  `"`     x@88k u@88c.      uL     9888i   .dL
                88888' X8888. >"8x  ^"8888""8888"  .ue888Nc.. `Y888k:*888.
                88888  ?88888< 888>   8888  888R  d88E`"888E`   888E  888I
                88888   "88888 "8%    8888  888R  888E  888E    888E  888I
                88888 '  `8888>       8888  888R  888E  888E    888E  888I
                `8888> %  X88!        8888  888R  888E  888E    888E  888I
                 `888X  `~""`   :    "*88*" 8888" 888& .888E   x888N><888'
                   "88k.      .~       ""   'Y"   *888" 888&    "88"  888
                     `""*==~~`                     `"   "888E         88F
                                                  .dWi   `88E        98"
                                                  4888~  J8%       ./"
                                                   ^"===*"`       ~`
            
            
                @author Federico Ghedina <fedeghe@gmail.com>
                @version 3.1.15
            
            */
            (function () {
                'use strict';
                console.log('\n\n ENGY v.3.1.15\n\n');
            
                // local cache for components
                //
                var components = {},
                    preloadedComponents = {},
                    config = {
                        fileNameSeparator: '/',
                        fileNamePrepend: '',
                        ext: '.js',
                        componentsUrl: '/components/'
                    };
            
                function _configSet (cnf) {
                    var j;
                    for (j in config) {
                        if (j in cnf) {
                            config[j] = cnf[j];
                        }
                    }
                    return this;
                }
            
                function _overwrite (destObj, path, obj) {
                    // path can be
                    // str1
                    // str1/str2[/str3[...]] (or str1.str2[.str3])
                    //
                    // in any case we need the elements of it
                    //
                    var pathEls = path.split(/\.|\//),
                        l = pathEls.length,
                        i = 0;
            
                    // in case path has more than one element in the split result
                    // like
                    // aaa/bbb/ccc/ddd
                    // dig destObj to destObj.aaa.bbb.ccc
                    //
                    while (i < l - 1) destObj = destObj[pathEls[i++]];
            
                    // now the object is inserted
                    //
                    destObj[pathEls[l - 1]] = obj;
                }
            
                function _mergeComponent (ns, path, o) {
                    var componentPH = NS.checkNs(path, ns),
                        replacementOBJ = o,
                        merged = {},
                        i = 0;
            
                    // start from the replacement
                    //
                    for (i in replacementOBJ) {
                        merged[i] = replacementOBJ[i];
                    }
                    // copy everything but 'component' & 'params', overriding
                    //
                    for (i in componentPH) {
                        !(i.match(/component|params/)) && (merged[i] = componentPH[i]);
                    }
                    _overwrite(ns, path, merged);
                }
            
                function Processor (config) {
                    this.config = config;
                    this.endPromise = NS.Balle.one();
                }
            
                Processor.prototype.getFileName = function (n) {
                    var els = n.split(/\/|\|/),
                        res = n,
                        l = els.length;
            
                    els[l - 1] = config.fileNamePrepend + els[l - 1];
                    res = els.join(config.fileNameSeparator);
            
                    return [
                        config.componentsUrl,
                        (config.componentsUrl.match(/\/$/) ? '' : '/'),
                        res,
                        config.ext
                    ].join('');
                };
            
            
                /**
                 * [run description]
                 * @return {[type]} [description]
                 */
                Processor.prototype.run = function () {
                    var self = this,
                        langFunc = NS.i18n.parse,
                        elementsN = 0,
                        // countPromise = NS.Balle.one(),
                        // solveTimePromise = NS.Balle.one(),
                        start = +new Date(), end,
                        xhrTot = 0,
                        requested = {},
                        cback,
                        computeStats = true,
                        stats = {
                            time: 0,
                            elements: 0,
                            requested: {},
                            xhrTot: 0
                        };
            
                    (function solve () {
                        var component = NS.object.digForKey(self.config, 'component', 1),
                            componentName,
                            cached, preLoaded,
                            xhrStart = 0,
                            xhrEnd = 0;
            
                        if (!component.length) {
                            end = +new Date();
                            stats.time = end - start;
                            stats.elements = elementsN;
                            stats.requested = requested;
                            stats.xhrTot = xhrTot;
                            self.endPromise.resolve([self.config, computeStats && stats]);
                        } else {
                            component = component[0];
                            componentName = self.getFileName(component.value);
                            if (component.value in requested) {
                                requested[component.value]++;
                            } else {
                                requested[component.value] = 1;
                                elementsN++;
                            }
                            cached = componentName in components;
                            preLoaded = componentName in preloadedComponents;
            
                            cback = function (cntORobj) {
                                xhrEnd = +new Date();
                                xhrTot += xhrEnd - xhrStart;
                                var params = NS.checkNs(component.container + '/params', self.config),
                                    obj,
                                    usedParams, foundParam, foundParamValue, foundParamValueReplaced, i, l;
                                if (preLoaded) {
                                    obj = _clone(cntORobj);
                                } else {
                                    if (!cached) {
                                        components[componentName] = _clone(cntORobj);
                                    }
                                    cntORobj = cntORobj.replace(/^[^{]*/, '')
                                        // .replace(/;?\n?$/, '')
                                        .replace(/(;?([\n\s]*)?)$/, '');
                                    // obj = eval('(' + cntORobj + ')');
                                    obj = eval('(' + cntORobj + ')');
                                }
                                // before merging the object check for the presence of parameters
                                if (params) {
                                    // check if into the component are used var placeholders
                                    usedParams = NS.object.digForValue(obj, /#PARAM{([^}|]*)?\|?([^}]*)}/);
                                    l = usedParams.length;
                                    if (l) {
                                        for (i = 0; i < l; i++) {
                                            // check if the label of the placeholder is in the params
                                            foundParam = NS.checkNs(usedParams[i].regexp[1], params);
                                            // in case use it otherwise, the fallback otherwise cleanup
                                            foundParamValue = typeof foundParam !== _U_ ? foundParam : (usedParams[i].regexp[2] || '');
                                            // string or an object?
                                            if ((typeof foundParamValue).match(/string/i)) {
                                                foundParamValueReplaced = NS.checkNs(usedParams[i].path, obj)
                                                    .replace(usedParams[i].regexp[0], foundParamValue);
            
                                                _overwrite(obj, usedParams[i].path, foundParamValueReplaced);
                                            } else {
                                                _overwrite(obj, usedParams[i].path, foundParamValue);
                                            }
                                        }
                                    }
                                }
                                if (component.container) {
                                    _mergeComponent(self.config, component.container, obj);
                                } else {
                                    self.config = obj;
                                }
                                solve();
                            };
                            xhrStart = +new Date();
                            // cached?
                            if (preLoaded) {
                                cback(preloadedComponents[componentName]);
                            } else if (cached) {
                                cback(components[componentName]);
                            } else {
                                NS.io.get(componentName, cback, true);
                            }
                        }
                    })();
            
                    // now i18n, maybe
                    //
                    langFunc && langFunc(self.config);
                    return self.endPromise;
                };
            
                function _process (a) {
                    return (new Processor(a)).run();
                }
            
                function _component (name, obj) {
                    if (!(name in preloadedComponents)) {
                        preloadedComponents[Processor.prototype.getFileName(name)] = obj;
                    }
                }
            
                function _components (cmps) {
                    for (var c in cmps) _component(c, cmps[c]);
                }
            
                function _clone (obj) {
                    if (obj == null || typeof obj !== 'object') {
                        return obj;
                    }
                    var copy = obj.constructor(),
                        attr;
                    for (attr in obj) {
                        if (obj.hasOwnProperty(attr)) copy[attr] = _clone(obj[attr]);
                    }
                    return copy;
                }
            
                NS.makeNs('Engy', {
                    component: _component,
                    components: _components,
                    configSet: _configSet,
                    define: _component,
                    get: function (params, clean, name) {
                        return NS.Balle.one(function (res, rej) {
                            return _process(params).then(res);
                        });
                    },
                    load: function (src) {
                        return NS.Widgzard.load(src);
                    },
                    getElement: function (n) {
                        return NS.Widgzard.getElement(n);
                    },
                    getElements: function () {
                        return NS.Widgzard.getElements();
                    },
                    process: _process,
                    report: function (stats) {
                        var j, ln = new Array(37).join('-');
                        console.log(ln);
                        console.log(
                            'Engy used ' + stats.elements + ' component' + (stats.elements === 1 ? '' : 's')
                        );
                        console.log('usage: ');
                        for (j in stats.requested) {
                            console.log(
                                '> ' + j + ': ' + stats.requested[j] + ' time' + (stats.requested[j] > 1 ? 's' : '')
                            );
                        }
                        console.log(
                            'Engy total time: '
                            + stats.time
                            + 'ms ('
                            + (stats.time - stats.xhrTot)
                            + ' unfolding, '
                            + stats.xhrTot
                            + ' xhr)'
                        );
                        console.log(ln);
                    },
                    render: function (params, clean, name) {
                        var t = +new Date();
                        return NS.Balle.one(function (res, rej) {
                            _process(params).then(function (r) {
                                r[1] && NS.Engy.report(r[1]);
                                var now = +new Date();
                                console.log('Engy process tot: ' + (now - t));
                                res(NS.Widgzard.render(r[0], clean, name));
                            });
                        });
                    }
                });
            })();
            
        
            return {
                Widgzard: {
                    render: NS.Widgzard.render,
                    cleanup: NS.Widgzard.cleanup,
                    load: NS.Widgzard.load,
                    get: NS.Widgzard.get,
                    getElement: NS.Widgzard.getElement,
                    getElements: NS.Widgzard.getElements,
        
                    getStore: NS.getStore,
                    Channel: NS.Channel,
                    events: NS.events,
                    cookie: NS.cookie,
                    utils: NS.utils,
                    i18n: NS.i18n,
                    io: NS.io,
                    object: NS.object,
                    css: NS.css,
                    dom: NS.dom,
                    timer: NS.timer,
                    history: NS.history
                },
                Engy: {
                    component: NS.Engy.component,
                    components: NS.Engy.components,
                    configSet: NS.Engy.configSet,
                    define: NS.Engy.define,
                    get: NS.Engy.get,
                    load: NS.Engy.loadStealth,
                    getElement: NS.Engy.getElement,
                    getElements: NS.Engy.getElements,
                    process: NS.Engy.process,
                    render: NS.Engy.render,
                    timer: NS.timer,
                    history: NS.history
                }
            };
        })('undefined', 'prototype');
        /* eslint-enable */
        

        // --------------------------
        Widgzard = t.Widgzard;
        Engy = t.Engy;
    })();
    
})();
/* eslint-enable */
