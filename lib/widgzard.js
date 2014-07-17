/**
 * Widgzard module
 * 
 * Create an arbitrary dom tree json based allowing for each node to 
 * specify a callback that will be called only when either
 *   > the node is appended (in case the node is a leaf)
 * ||
 *   > every child has finished (explicitly calling the done function on his context)
 *
 * @author Federico Ghedina <fedeghe@gmail.com>
 */
(function (W){
    
    'use strict';

    

    // clearer class that should provide right
    // css float clearing
    // ex: TB uses `clearfix`, I don`t
    // 
    var clearerClassName = 'clearer',
        noop = function () {},
        delegate,
        eulerWalk,
        autoclean = true,
        htmlspecialchars,
        load;

    /**
     * Main object constructor represeting any node created
     * @param {[type]} conf the object that has the information about the node
     *                      that will be created
     * @param {[type]} trg  the DomNODE where the element will be appended to
     * @param {[type]} mapcnt an object used to allow the access from any node
     *                        to every node that has the gindID attribute
     */
    function Wnode(conf, trg, mapcnt) {

        // save a reference to the instance
        // 
        var self = this,

            // the tag used for that node can be specified in the conf
            // otherwise will be a div (except for 'clearer') 
            tag = conf.tag || "div";

        // save a reference to the target parent for that node
        // by means of the callback promise chain, in fact the 
        // real parent for the node can even be different as 
        // specified in the conf.target value
        // 
        this.target = trg;

        // create the node
        // 
        this.node = document.createElement(tag);

        // save a reference toe the node configuration
        // will be useful on append to append to conf.target
        // if specified
        //
        this.conf = conf;

        // save a reference to the node callback if speficied
        // otherwise create a function that do nothing but
        // freeing the parent promise from waiting
        //
        this.node.WIDGZARD_cb = conf.cb || function () {
            // autoresolve
            self.node.resolve();
        };

        // save a reference to a brand new Promise
        // the Promise.node() will be called as far as
        // all the child elements cb have called 
        // this.done OR this.resolve
        // 
        this.node.WIDGZARD_promise = new Promise();

        // When called Promise.done means that 
        // the parent callback can be called
        // delegating the parent context
        //
        this.node.WIDGZARD_promise.then(trg.WIDGZARD_cb, trg);

        // as said at the begibbibg every node keeps a reference
        // to a function that allow to get a reference to any
        // node that in his configuration has a `wid` value
        // specified
        //
        this.map = mapcnt.map;
        this.node.getNode = mapcnt.getNode;

        // how many elements are found in the content field?
        // that counter is fundamental for calling this node
        // callback only when every child callback has done
        // 
        this.node.WIDGZARD_len = conf.content ? conf.content.length : 0;

        // through these two alias from within a callback
        // (where the DOMnode is passed as context)
        // the have to declare that has finished
        // if the count is nulled it means that the promise 
        // is done, thus it`s safe to call its callback
        //
        this.node.done = this.node.resolve = function () {
          
            // if all the child has called done/resolve
            // it`s time to honour the node promise,
            // thus call the node callback
            // 
            !--self.target.WIDGZARD_len && self.node.WIDGZARD_promise.done();
        };
    }

    /**
     * Set neo attributes
     * @param {DOMnode} node  the node
     * @param {Object} attrs  the hash of attributes->values
     */
    Wnode.prototype.setAttrs = function (node, attrs) {
        // if set, append all attributes (*class)
        // 
        if (typeof attrs !== 'undefined') { 
            for (var j in attrs) {
                if (j !== 'class') {
                    if (j !== 'style') {
                        node.setAttribute(j, attrs[j]);
                    } else {
                        this.setStyle(node, attrs.style);
                    }
                } else {
                    node.className = attrs[j];
                }
                    
                
            }
        }
        return this;
    };

    /**
     * Set node inline style
     * @param {DOMnode} node  the node
     * @param {Object} style  the hash of rules
     */
    Wnode.prototype.setStyle = function (node, style) {
        // if set, append all styles (*class)
        //
        if (typeof style !== 'undefined') { 
            for (var j in style) {
                node.style[j.replace(/^float$/i, 'cssFloat')] = style[j];
            }
        }
        return this;
    };

    /**
     * Set node data
     * @param {DOMnode} node  the node
     * @param {Object} data   the hash of properties to be attached
     */
    Wnode.prototype.setData = function (node, data) {
        node.data = data || {};
        return this;
    };
    
    /**
     * add method for the Wnode
     */
    Wnode.prototype.add = function () {

        var conf = this.conf,
            node = this.node;

        // set attributes and styles
        // 
        this.setAttrs(node, conf.attrs)
            .setStyle(node, conf.style)
            .setData(node, conf.data);

        // if `html` key is found on node conf 
        // inject its value
        //
        typeof conf.html !== 'undefined' && (node.innerHTML = conf.html);
        
        // save a reference back to json
        //
        //// this.conf.node = this.node;

        // if the node configuration has a `wid` key
        // (and a String value), the node can be reached 
        // from all others callback invoking
        // this.getNode(keyValue)
        //
        typeof conf.wid !== 'undefined' && (this.map[conf.wid] = node);

        // if the user specifies a node the is not the target 
        // passed to the constructor we use it as destination node
        // (node that in the constructor the node.target is always
        // the target passed)
        // 
        (conf.target || this.target).appendChild(node);
        node.WIDGZARD = true;

        // if the node configuration do not declares content array
        // then the callback is executed.
        // in the callback the user is asked to explicitly declare
        // that the function has finished the work invoking
        // this.done() OR this.resolve()
        // this is the node itself, those functions are attached
        // 
        !conf.content && node.WIDGZARD_cb.call(node);

        return node;
    };


    function cleanup(node) {


        var keys = [
                'WIDGZARD',
                'WIDGZARD_cb',
                'WIDGZARD_promise',
                'WIDGZARD_length',
                'getNode',
                'done',
                'resolve',
                'data'
            ],
            elsToBeCleaned = [],
            i = 0,
            l = keys.length,
            removeNode = function (n) {
                var parent = n.parentNode;
                parent.removeChild(n);
                return true;
            };

        eulerWalk(node, function (n, p) {

            if (n !== node && n.nodeType != 3) {
                elsToBeCleaned.push(n);
            }

        }, 'post');
        
        for (var  j = 0, k = elsToBeCleaned.length; j < k; j++) {
            var n = elsToBeCleaned[j];
            for (null; i < l; i++) {                    
                n[keys[i]] = null;
            }
            
            removeNode(n); //&& console.log('removed > ', n);
        }
        return true;
    }

    /**
     * PUBLIC function to render Dom from Json
     * @param  {Object} params the configuration json that contains all the 
     *                         information to build the dom :
     *                         target : where to start the tree
     *                         content : what to create
     *                         {cb} : optional end callback
     *                         {style} : optional styles for the target Node
     *                         {attrs} : optionsl attributes to be added at the target Node
     *                         
     * @param  {boolean} clean whether or not the target node must be emptied before
     *                         creating the tree inside it.
     * @return {undefined}
     */
    function render (params, clean) {

        var target = params.target || document.body;

        // maybe cleanup previous
        //
        autoclean && target.WIDGZARD && cleanup(target)

        if (!params) {
            throw new Exception('ERROR : Check parameters for render function');
        }

        // a literal used to save a reference 
        // to all the elements that need to be 
        // reached afterward calling this.getNode(id)
        // from any callback
        // 
        var inner = {
            map : {},
            getNode : function (id) {
                return inner.map[id] || false;
            }
        };

        // rape Node prototype funcs
        // to set attributes & styles
        // 
        Wnode.prototype
            .setAttrs(target, params.attrs)
            .setStyle(target, params.style)
            .setData(target, params.data);

        // maybe clean
        // 
        if (!!clean) target.innerHTML = '';

        // maybe a raw html is requested before treating content
        if (typeof params.html !== 'undefined') {
            target.innerHTML = params.html;
        }
        
        // initialize the root node to respect what is needed
        // by the childs node Promise 
        // 
        // - len : the lenght of the content array
        // - cb : exactly the end callback
        // 
        target.WIDGZARD_len = params.content.length;
        target.WIDGZARD_cb = params.cb || function () {};

        //flag to enable cleaning
        target.WIDGZARD = true;

        // allow to use getNode from root
        // 
        target.getNode = inner.getNode;

        // start recursion
        // 
        (function recur(cnf, trg){
            
            // change the class if the element is simply a "clearer" String
            // 
            if (cnf.content) {
                for (var i = 0, l = cnf.content.length; i < l; i++) {
                    if (cnf.content[i] === clearerClassName) {
                        cnf.content[i] = {
                            tag : 'br',
                            attrs : {'class' : clearerClassName}
                        };
                    }
                    recur(cnf.content[i], new Wnode(cnf.content[i], trg, inner).add());
                }
            }
            
        })(params, target);
    }

    // ------------------------------------------------
    function Promise() {
        this.cbacks = [];
        this.len = 0;
        this.completed = false;
        this.res = false;
        this.err = false;
        this.reset = function () {
            this.len = 0;
            this.cbacks = [];
        };
    };
    Promise.prototype.done = function (res, err) {
        var i = 0;
        this.completed = true;
        this.res = res;
        this.err = err;
        for (null; i < this.len; i += 1) {
            this.cbacks[i](res, err);
        }
        this.reset();
    };
    Promise.prototype.then = function (cback, ctx) {
        var func = delegate(cback, ctx);
        if (this.completed) {
            func(this.res, this.err);
        } else {
            this.cbacks[this.len] = func;
            this.len += 1;
        }
        return this;
    };

    eulerWalk = function (root, func, mode) {
        mode = {pre : 'pre', post : 'post'}[mode] || 'post';
        var nope = function () {},
            pre = mode === 'pre' ? func : nope,
            post = mode === 'post' ? func : nope,
            walk = (function (m) {
                return function (n, _n) {
                    pre(n);
                    _n = n.firstChild;
                    while (_n) {
                        walk(_n);
                        _n = _n.nextSibling;
                    }
                    post(n);
                };
            })(mode);

        walk(root);
    };

    
    /**
     * Dummy delegation function 
     * @param  {[type]} func [description]
     * @param  {[type]} ctx  [description]
     * @return {[type]}      [description]
     */
    delegate = function (func, ctx) {
    
        // get relevant arguments
        // 
        var args = Array.prototype.slice.call(arguments, 2);
        
        // return the function
        //
        return function() {
            return func.apply(
                ctx || window,
                [].concat(args, Array.prototype.slice.call(arguments))
            );
        };
    };
    

    // FG.doScript('js/_index.js');
    load = function (src) {
        var s = document.createElement('script');
        document.getElementsByTagName('head')[0].appendChild(s);
        s.src = src;
        
        // when finished remove the script tag
        //
        s.onload = function () {
            s.parentNode.removeChild(s);
        }
    };

    htmlspecialchars = function (c) {
        return '<pre>' +
            c.replace(/&(?![\w\#]+;)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;'); +
            '</pre>';
    };


    // publish module
    W.Widgzard = {
        render : render,
        load : load,
        htmlspecialchars : htmlspecialchars
    };

})(this);