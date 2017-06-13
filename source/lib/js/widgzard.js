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
	

	console.log("\n\n WIDGZARD v.$VERSION.WIDGZARD$\n\n")

	'use strict';    

	// clearer class that should provide right
	// css float clearing
	// ex: TB uses `clearfix`, I don`t
	// 
	var __clearerClassName = 'clearer', 
		__nodeIdentifier = 'wid',
		__autoclean = true,
		__debug = false,
		__promise = $NS$.Promise,
		// noop = function () {},
		// time = 0,
		__renders = {};

	$$../Wnode.js$$

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
	$NS$.Widgzard = {
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