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
													^"===*"`                              v.0.2


 * Widgzard module
 * 
 * Create an arbitrary dom tree json based allowing for each node to 
 * specify a callback that will be called only when either
 *   > the node is appended (in case the node is a leaf)
 * ||
 *   > every child has finished (explicitly calling the done function on his context)
 *
 * @author Federico Ghedina <federico.ghedina@gmail.com> <2017>
 *
 *

*/
/*
[Malta] ../promise.js
*/
/**
 * [Channel description]
 * @param {[type]} n [description]
 */
FG.Promise = (function () {

    // MY WONDERFUL Promise Implementation
    // 
    
    var _Promise = function() {
            this.cbacks = [];
            this.solved = false;
            this.result = null;
        },
        proto = _Promise.prototype;
    /**
     * [then description]
     * @param  {[type]} func [description]
     * @param  {[type]} ctx  [description]
     * @return {[type]}      [description]
     */
    proto.then = function(func, ctx) {
        var self = this,
            f = function() {
                self.solved = false;
                func.apply(ctx || self, [ctx || self, self.result]);
            };
        if (this.solved) {
            f();
        } else {
            this.cbacks.push(f);
        }
        return this;
    };

    /**
     * [done description]
     * @return {Function} [description]
     */
    proto.done = function() {
        var r = [].slice.call(arguments, 0);
        this.result = r;
        this.solved = true;
        if (!this.cbacks.length) {
            return this.result;
        }
        this.cbacks.shift()(r);
    };


    /**
     * [chain description]
     * @param  {[type]} funcs [description]
     * @param  {[type]} args  [description]
     * @return {[type]}       [description]
     */
    function chain(funcs, args) {

        var p = new _Promise();
        var first = (function() {

                funcs[0].apply(p, [p].concat([args]));
                return p;
            })(),
            tmp = [first];

        for (var i = 1, l = funcs.length; i < l; i++) {
            tmp.push(tmp[i - 1].then(funcs[i]));
        }
        return p;
    }

    /**
     * [join description]
     * @param  {[type]} pros [description]
     * @param  {[type]} args [description]
     * @return {[type]}      [description]
     */
    function join(pros, args) {
        var endP = new _Promise(),
            res = [],
            stack = [],
            i = 0,
            l = pros.length,
            limit = l,
            solved = function (remainder) {
                !remainder && endP.done.apply(endP, res);
            };

        for (null; i < l; i++) {
            (function (k) {
                stack[k] = new _Promise();

                // inside every join function the context is a Promise, and
                // is possible to return it or not 
                var _p = pros[k].apply(stack[k], [stack[k], args]);
                (_p instanceof _Promise ? _p : stack[k])
                .then(function (p, r) {
                    res[k] = r;
                    solved(--limit);
                });
            })(i);
        }
        return endP;
    }

    /* returning module
    */
    return {
        create: function() {
            return new _Promise();
        },
        chain: chain,
        join: join
    };
    
})();
/*
[Malta] ../widgzard.js
*/
/**

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


 * Widgzard module
 * 
 * Create an arbitrary dom tree json based allowing for each node to 
 * specify a callback that will be called only when either
 *   > the node is appended (in case the node is a leaf)
 * ||
 *   > every child has finished (explicitly calling the done function on his context)
 *
 * @author Federico Ghedina <fedeghe@gmail.com>
 *
 *
 *
 * PLEASE read this : http://stackoverflow.com/questions/1915341/whats-wrong-with-adding-properties-to-dom-element-objects
 */

(function (W){
	

	console.log("\n\n WIDGZARD v.0.2\n\n")

	'use strict';    

	// clearer class that should provide right
	// css float clearing
	// ex: TB uses `clearfix`, I don`t
	// 
	var __clearerClassName = 'clearer', 
		__nodeIdentifier = 'wid',
		__autoclean = true,
		__debug = false,
		__promise = FG.Promise,
		// noop = function () {},
		// time = 0,
		__renders = {};

	/*
	[Malta] ../Wnode.js
	*/
	/**
	 * Main object constructor represeting any node created
	 * @param {[type]} conf the object that has the information about the node
	 *                      that will be created
	 * @param {[type]} trg  the DomNODE where the element will be appended to
	 * @param {[type]} mapcnt an object used to allow the access from any node
	 *                        to every node that has the gindID attribute
	 */
	function Wnode(conf, trg, mapcnt) {
		
		"use strict"
	
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
		this.node = conf.ns ? document.createElementNS(conf.ns, tag) : document.createElement(tag);
	
		// save a reference to the node configuration
		// will be useful on append to append to conf.target
		// if specified
		//
		this.conf = conf;
	
		
	
		// a reference the the root
		//
		this.root = mapcnt.root;
	
		// save a reference to the parent
		// 
		this.parent = trg;
	
		// as said at the beginning every node keeps a reference
		// to a function that allow to get a reference to any
		// node that in his configuration has a `__nodeIdentifier` value
		// specified
		//
		this.map = mapcnt.map;
	
		// function to abort all
		//
		this.abort = mapcnt.abort;
	
		// publish in the node the getNode fucntion that allows for
		// getting any node produced from the same json having a 
		// `__nodeIdentifier` with a valid value
		// 
		this.getNode = mapcnt.getNode;
	
	
		// get all nodes mapped
		// 
		this.getNodes = mapcnt.getNodes;
	
	
		// save a reference to a brand new Promise
		// the Promise.node() will be called as far as
		// all the child elements cb have called 
		// this.done OR this.resolve
		// 
		this.WIDGZARD_promise = __promise.create();
	
		// save a reference to the node callback if speficied
		// otherwise create a function that do nothing but
		// freeing the parent promise from waiting
		//
		this.WIDGZARD_cb = conf.cb || function () {
			__debug && console.log('autoresolving  ', self.node);
			// autoresolve
			self.resolve();
		};
	
		// When called Promise.done means that 
		// the parent callback can be called
		// delegating the parent context
		//
		this.WIDGZARD_promise.then(self.WIDGZARD_cb, self);
	
		// how many elements are found in the content field?
		// that counter is fundamental for calling this node
		// callback only when every child callback has done
		// 
		this.WIDGZARD_len = conf.content ? conf.content.length : 0;
	
		// through these two alias from within a callback
		// (where the DOMnode is passed as context)
		// the have to declare that has finished
		// if the count is nulled it means that the promise 
		// is done, thus it`s safe to call its callback
		//
		this.done = this.resolve = this.solve = function () {
		  
			// if all the child has called done/resolve
			// it`s time to honour the node promise,
			// thus call the node callback
			//
			if (--self.target.WIDGZARD_len == 0) {
				if (self.target.WIDGZARD_promise) {
					self.target.WIDGZARD_promise.done();
				} else {
					self.target.WIDGZARD_cb();   
				}
			}
	
		};
	
		this.lateWid = mapcnt.lateWid;
	}
	
	
	
	/**
	 * save a function to climb up n-parent
	 * @param  {[type]} n [description]
	 * @return {[type]}   [description]
	 */
	Wnode.prototype.climb = function (n) {
		n = n || 1;
		var ret = this;
		while (n--) {
			ret = ret.parent;
		}
		return ret;
	};
	
	/**
	 * and one to go down
	 * @return {[type]} [description]
	 */
	Wnode.prototype.descendant = function () {
		var self = this,
			args = Array.prototype.slice.call(arguments, 0),
			i = 0,
			res = self,
			l = args.length;
		if (!l) return res;
		while (i < l) {
			res = res.childrens[~~args[i++]];
		}
		return res;
	};
	
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
	Wnode.prototype.setData = function (el, data) {
		el.data = data || {};
		return this;
	};
	
	/**
	 * [checkInit description]
	 * @param  {[type]} el [description]
	 * @return {[type]}    [description]
	 */
	Wnode.prototype.checkInit = function (el, conf) {
		var keepRunning = true;
		if ('init' in conf && typeof conf.init === 'function') {
			keepRunning = conf.init.call(el);
			!keepRunning && el.abort();
		}
		return this;
	}
	
	/**
	 * [checkInit description]
	 * @param  {[type]} el [description]
	 * @return {[type]}    [description]
	 */
	Wnode.prototype.checkEnd = function (el, conf) {
		if ('end' in conf && typeof conf.end === 'function') {
			this.root.endFunctions.push(function () {conf.end.call(el);});
		}
		return this;
	}
	
	/**
	 * add method for the Wnode
	 */
	Wnode.prototype.add = function () {
	
		var conf = this.conf,
			node = this.node,
			tmp,i,j,k;
	
		// set attributes and styles
		// 
		this.setAttrs(node, conf.attrs)
			.setStyle(node, conf.style)
			.setData(this, conf.data)
			.checkInit(this, conf)
			.checkEnd(this, conf);
	
		// if `html` key is found on node conf 
		// inject its value
		//
		if (typeof conf.html !== 'undefined') {
			node.innerHTML = conf.html;
	
	
			/**
			 * ABSOLUTELY EXPERIMENTAL 2WDB
			 */
			tmp = node.innerHTML.match(/2wdb\((.*)\)/);
			if (tmp) {
				
				i = FG.checkNS(tmp[1], this);
				if (i !== undefined) {
					j = ('this.' + tmp[1]).split('.');
					k = j.pop();
					// console.log(j, k)
					i = eval(j.join('.'));
					// console.log(i)
					k in i && FG.events.ww.on(i, k, node);
				}
				
			}
			// 2WDB end
	
	
		}
	
		// if `text` is found on node conf
		// it will be appended
		//  
		if (typeof conf.text !== 'undefined') {
			tmp = document.createTextNode("" + conf.text);
			node.appendChild(tmp);
		}
	
		// if the node configuration has a `__nodeIdentifier` key
		// (and a String value), the node can be reached 
		// from all others callback invoking
		// this.getNode(keyValue)
		//
		
		if (typeof conf[__nodeIdentifier] !== 'undefined') {
			this.map[conf[__nodeIdentifier]] = this;
		}
		
		// if the user specifies a node the is not the target 
		// passed to the constructor we use it as destination node
		// (node that in the constructor the node.target is always
		// the target passed)
		// 
		(conf.target || this.target.node).appendChild(node);
	
		if (!('childrens' in (conf.target || this.target))) {
			(conf.target || this.target).childrens = [];
		}
		(conf.target || this.target).childrens.push(this);
	
		this.WIDGZARD = true;
	
		// if the node configuration do not declares content array
		// then the callback is executed.
		// in the callback the user is asked to explicitly declare
		// that the function has finished the work invoking
		// this.done() OR this.resolve()
		// this is the node itself, those functions are attached
		// 
		(!conf.content || conf.content.length == 0) && this.WIDGZARD_cb.call(this);
	
		// chain
		return this;
	};

	function cleanupWnode(trg) {
		var node = trg.node,
			removeNode = function (t) {
				t.parentNode.removeChild(t);
				return true;
			},
			nodesToBeCleaned = [],
			keys = ['WIDGZARD', 'WIDGZARD_cb', 'WIDGZARD_promise', 'WIDGZARD_length', 'parent', 'getNode', 'climb', 'root', 'done', 'resolve', 'data'],
			kL = keys.length,
			i = 0, j = 0, k = 0,
			n = null;
		
		// pick up postorder tree traversal
		eulerWalk(node, function (n) {
			//skip root & text nodes
			n !== node && n.nodeType != 3 && nodesToBeCleaned.push(n) && k++;
		}, 'post');
		
		while (j < k) {
			n = nodesToBeCleaned[j++];
			while (i < kL) n[keys[i++]] = null;
			removeNode(n);
		}
		nodesToBeCleaned = null,
		keys = null;
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
	function render (params, clean, name) {

		var t1 = +new Date(),
			target = {
				node : params.target || document.body,
				endFunctions : [],
				childrens : [],
				reload : function () {
					render(params, true);
				}
			},
			targetFragment = {
				node : document.createDocumentFragment('div')
			},
			active = true,
			originalHTML = target.node.innerHTML + "",
			t2,
			mapcnt;
		
		// debug ? 
		__debug = !!params.debug;

		// maybe cleanup previous
		//
		__autoclean && target.WIDGZARD && cleanupWnode(target)

		if (!params) {
			throw new Exception('ERROR : Check parameters for render function');
		}

		// a literal used to save a reference 
		// to all the elements that need to be 
		// reached afterward calling this.getNode(id)
		// from any callback
		// 
		mapcnt = {
			root : target,
			map : {},
			getNode : function (id) {
				return mapcnt.map[id] || false;
			},
			getNodes : function () {
				return mapcnt.map;
			},
			abort : function () {
				
				active = false;
				target.node.innerHTML = originalHTML;
				
				'onAbort' in params &&
				(typeof params.onAbort).match(/function/i) &&
				params.onAbort.call(null, params);
				
				return false;
			},
			lateWid : function (wid) {
				mapcnt.map[wid] = this;
			}
		};

		// rape Node prototype funcs
		// to set attributes & styles
		// and check init function 
		// 
		Wnode.prototype
			.setAttrs(target.node, params.attrs)
			.setStyle(target.node, params.style)
			.setData(target, params.data)
			.setData(targetFragment, params.data);

		// target.descendant = Wnode.prototype.descendant;
		targetFragment.descendant = Wnode.prototype.descendant;
		
		// maybe clean
		// 
		if (!!clean) target.node.innerHTML = '';

		// maybe a raw html is requested before treating content
		// 
		if (typeof params.html !== 'undefined') {
			target.node.innerHTML = params.html;
		}
		
		// initialize the root node to respect what is needed
		// by the childs node Promise 
		// 
		// - len : the lenght of the content array
		// - cb : exactly the end callback
		// 
		
		//target.WIDGZARD_len = params.content ? params.content.length : 0;
		targetFragment.WIDGZARD_len = params.content ? params.content.length : 0;

		targetFragment.WIDGZARD_cb = target.WIDGZARD_cb = function () {
			active 
			&&
			target.node.appendChild(targetFragment.node)
			&&
			params.cb && params.cb.call(target);

			//ending functions
			//
			if (target.endFunctions.length) {
				for (var i = 0, l = target.endFunctions.length; i < l; i++) {
					target.endFunctions[i]();
				}
			}
		};

		// flag to enable cleaning
		//
		//targetFragment.WIDGZARD =
		target.WIDGZARD = true;

		// allow to use getNode & getNodes from root
		// 
		//targetFragment.getNode =
		target.getNode = mapcnt.getNode;
		//targetFragment.getNodes =
		target.getNodes = mapcnt.getNodes;
		//targetFragment.abort =
		target.abort = mapcnt.abort;
		//targetFragment.map =
		target.map = mapcnt.map;
		//targetFragment.report =
		target.report = function  () {
	        window.JSON && console.log('json size : ' + JSON.stringify(params).length);
	        console.log('html size : ' + target.node.innerHTML.length);
	    }

		// what about a init root function?
		// 
		Wnode.prototype.checkInit(targetFragment, params);
		
		// start recursion
		//
		(function recur(cnf, trg){
			if (!active) {
				return false;
			}
			// change the class if the element is simply a "clearer" String
			// 
			if (cnf.content) {
				for (var i = 0, l = cnf.content.length; i < l; i++) {
					if (cnf.content[i] === __clearerClassName) {
						cnf.content[i] = {
							tag : 'br',
							attrs : {'class' : __clearerClassName}
						};
					}
					// in case a ns is specified, use it through all the subtree automatically
					if ('ns' in cnf) cnf.content[i].ns = cnf.ns;
					recur(cnf.content[i], new Wnode(cnf.content[i], trg, mapcnt).add());
				}
			}
		})(params, targetFragment);

		// if no content in the root there are no childs
		// thus, let the cb execute
		// 
		if (!('content' in params)) {
			targetFragment.WIDGZARD_cb();
		}

		// maybe save the reference
		//
		if (name && !(name in __renders)) __renders[name] = target;

		t2 = +new Date();
		
		console.debug('Widgzard render time: ' + (t2-t1) + 'ms');
		
		return target;
	}

	/**
	 * [get description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	function get (params) {
		var r = document.createElement('div');
		params.target = r;
		render(params);
		return r;
	}

	function cleanup(trg, msg){
		render({target : trg, content : [{html : msg || ""}]}, true);
	}
	
	function load (src) {
		var s = document.createElement('script');
		document.getElementsByTagName('head')[0].appendChild(s);
		s.src = src;
		
		// when finished remove the script tag
		// 
		s.onload = function () {
			s.parentNode.removeChild(s);
		}
	};

	/**
	 * [eulerWalk description]
	 * @param  {[type]} root [description]
	 * @param  {[type]} func [description]
	 * @param  {[type]} mode [description]
	 * @return {[type]}      [description]
	 */
	 function eulerWalk(root, func, mode) {
		mode = {pre : 'pre', post : 'post'}[mode] || 'post';
		var nope = function () {},
			pre = mode === 'pre' ? func : nope,
			post = mode === 'post' ? func : nope;

		(function walk(n_, _n) {
			pre(n_);
			_n = n_.firstChild;
			while (_n) {
				walk(_n);
				_n = _n.nextSibling;
			}
			post(n_);
		})(root);
	}

	function htmlspecialchars(c) {
        return '<pre>' +
            c.replace(/&(?![\w\#]+;)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;') +
        '</pre>';
    };

	// publish module
	// 
	FG.Widgzard = {
		render : render,
		cleanup : cleanup,
		get : get,
		load : load,
		htmlspecialchars : htmlspecialchars,
		getElement : function(n) {
			return n in __renders ? __renders[n] : false;
		},
		getElements : function () {
			return __renders;
		},
		Promise : __promise
	};

})(this);
/*------------------------*/
/*
[Malta] ../engy.js
*/
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
	                                   ^"===*"`       ~`  v.0.3 the razor
  

	@author Federico Ghedina <fedeghe@gmail.com>
	@date 22-04-2016
	@version 0.3

*/
FG.makeNS('engy', function () {

	console.log("\n\n ENGY v.0.3\n\n");

	// local cache for components
	// 
	var components = {},
		preloadedComponents = {},

		config = {
			fileNameSeparator: 	"/",
			fileNamePrepend: 	"",
			ext: 				".js",
			componentsUrl: 		"/components/"
		},
		num = 0;


	function _configSet(cnf) {
		var j;
		for (j in config) {
			if (j in cnf){
				config[j] = cnf[j];
			}
		}
		return this;
	}

	/**
	 * [_overwrite description]
	 * @param  {object} ns   the namespace of destination
	 * @param  {string} path the target path into the namespace
	 * @param  {object} o    the object to be inserted
	 * @return {void}      	 [description]
	 */
	function _overwrite(destObj, path, obj) {

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
		while (i < l-1) destObj = destObj[pathEls[i++]];

		// now the object is inserted
		//
		destObj[pathEls[l-1]] = obj;
	}

	/**
	 * [_mergeComponent description]
	 * @param  {[type]} ns   [description]
	 * @param  {[type]} path [description]
	 * @param  {[type]} o    [description]
	 * @return {[type]}      [description]
	 */
	function _mergeComponent(ns, path, o) {
		
		var componentPH = FG.checkNS(path, ns),
			replacementOBJ = o,
			merged = {}, i,
			pathEls = path.split(/\.|\//),
			i = 0, l = pathEls.length;

		// start from the replacement
		// 
		for (i in replacementOBJ)
			merged[i] = replacementOBJ[i];

		// copy everything but 'component' & 'params', overriding
		// 
		for (i in componentPH)
			!(i.match(/component|params/)) && (merged[i] = componentPH[i]);

		_overwrite(ns, path, merged);
	}

	function Processor(config) {
		// console.log(config)
		this.config = config;
		this.endPromise = FG.Promise.create();
	}

	/**
	 * [getFileName description]
	 * @param  {[type]} n [description]
	 * @return {[type]}   [description]
	 */
	Processor.prototype.getFileName = function (n) {
		var els = n.split(/\/|\|/),
			res = n,
			l = els.length;
		
		els[l-1] = config.fileNamePrepend + els[l-1];
		res = els.join(config.fileNameSeparator);

		return config.componentsUrl  + res + config.ext;
	};

	
	/**
	 * [run description]
	 * @return {[type]} [description]
	 */
	Processor.prototype.run = function () {
		var self = this,
			langFunc = FG.i18n.parse,
			elementsN = 0,
			countPromise = FG.Promise.create(),
			solveTime = FG.Promise.create(),
			start = +new Date(), end,
			xhrTot = 0,
			cback;


		(function solve() {
			var component = FG.object.digForKey(self.config, 'component', 1),
				componentName,
				
				cached, preLoaded,

				innerPromise = FG.Promise.create(),
				xhrStart = 0,
				xhrEnd = 0;

			innerPromise.then(solve);

			if (!component.length) {

				end = +new Date();
				self.endPromise.done(self.config);
				countPromise.done(elementsN);
				solveTime.done(end - start);

			} else {

				elementsN++;
				component = component[0];
				componentName = self.getFileName(component.value);
				cached = componentName in components;
				preLoaded = componentName in preloadedComponents;

				// console.log(componentName, preLoaded)

				cback = function (cntORobj) {
					xhrEnd = +new Date;
					xhrTot += xhrEnd - xhrStart;

 					var params = FG.checkNS(component.container + '/params', self.config),
						obj,
						usedParams, foundParam, foundParamValue, foundParamValueReplaced, i, l;

					if (preLoaded) {
						obj = _clone(cntORobj);
					} else {
						if (!cached) {
							components[componentName] = _clone(cntORobj);
						}
						cntORobj = cntORobj.replace(/^[^{]*/, '').replace(/;?$/, '');
						obj = eval('(' + cntORobj + ')');
					}


//
//
//					if (!cached) {
//						components[componentName] = xhrResponseText;
//					}
//					
//					xhrResponseText = xhrResponseText.replace(/^[^{]*/, '')
//									.replace(/;?$/, '');
//
//					obj = eval('(' + xhrResponseText + ')');




					// before merging the object I check for the presence of parameters
					//
					if (params) {

						// check if into the component are used var placeholders
						// 
						usedParams = FG.object.digForValue(obj, /#PARAM{([^}|]*)?\|?([^}]*)}/);


						l = usedParams.length;

						if (l) {

							for (i = 0; i < l; i++) {
								
								// check if the label of the placeholder is in the params
								//
								foundParam = FG.checkNS(usedParams[i].regexp[1], params);
								
								// in case use it otherwise, the fallback otherwise cleanup
								//
								foundParamValue = typeof foundParam !== 'undefined' ? foundParam : (usedParams[i].regexp[2] || "");
								
								// string or an object?
								//

								if ((typeof foundParamValue).match(/string/i)){

									foundParamValueReplaced = FG.checkNS(usedParams[i].path, obj)
										.replace(usedParams[i].regexp[0],  foundParamValue);
									
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

					innerPromise.done();
				};

				// maybe is cached
				//
				xhrStart = +new Date;

				if (preLoaded) {
					cback (preloadedComponents[componentName]);
				} else if (cached) {
					cback (components[componentName]);
				} else {
					FG.io.get(componentName, cback, true);
				}
			}
		})();

		// now i18n, maybe
		//
		langFunc && langFunc(self.config);
		

		countPromise.then(function (pro ,par){
			console.log("Engy components used: " + par[0]);
		});

		solveTime.then(function (pro ,par){
			console.log("Engy time for getting components via xhr: " + xhrTot);
			console.log("      \"       unfolding : " + (par[0] - xhrTot));
			console.log("      \"       solving (xhr included): " + par[0]);
		});

		return self.endPromise;
	};

	function _process(a) {
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

	function _clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = _clone(obj[attr]);
		}
		return copy;
	}


	return {
		configSet : _configSet,
		process : _process,
		component : _component,
		components : _components,
		get  : function (params, clean, name) {
			var pRet = FG.Promise.create();
			_process(params).then(function(p, r) {
			    pRet.done(FG.Widgzard.get(r[0]));
			});
			return pRet;
		},
		load : function (src) {
			return FG.Widgzard.load(src);	
		},
		getElement : function(n) {
			return FG.Widgzard.getElement(n);
		},
		getElements : function () {
			return FG.Widgzard.getElements();
		},
		render : function (params, clean, name) {
			var self = this,
				t = +new Date,
				pRet = FG.Promise.create();

			_process(params).then(function(p, r) {
			    console.log('t: ' + (+new Date - t));
			    pRet.done(FG.Widgzard.render(r[0], clean, name));
			});
			return pRet;
		}
	};
}, FG);
