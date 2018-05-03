/**
 * Main object constructor represeting any node created
 * @param {[type]} conf the object that has the information about the node
 *                      that will be created
 * @param {[type]} trg  the DomNODE where the element will be appended to
 * @param {[type]} mapcnt an object used to allow the access from any node
 *                        to every node that has the gindID attribute
 */
function Wnode(conf, trg, mapcnt) {
	
	"use strict";

	// save a reference to the instance
	// 
	var self = this,
		// the tag used for that node can be specified in the conf
		// otherwise will be a div (except for 'clearer') 
		//
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

	//
	this.data = {};

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
		__debug && console.log("autoresolving  ", self.node);
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
		if (--self.target.WIDGZARD_len === 0) {
			if (self.target.WIDGZARD_promise) {
				self.target.WIDGZARD_promise.done();
			} else {
				self.target.WIDGZARD_cb();   
			}
		}

	};
	this.lateWid = mapcnt.lateWid;

	this.events = {
		onChange : true,
		onClick : true,
		onMouseover : true,
		onMouseout : true,
		onMouseout : true,
		onDblclick : true,
		onFocus : true,
		onChange : true,
		onSelect : true,
		onKeyup : true,
		onSubmit : true,
		onBlur : true
	};
}

/**
 * save a function to climb up n-parent
 * @param  {[type]} n [description]
 * @return {[type]}   [description]
 */
Wnode.prototype.climb = function (n) {
	"use strict";
	n = n || 1;
	var ret = this;
	while (n--) ret = ret.parent;
	return ret;
};

/**
 * and one to go down
 * @return {[type]} [description]
 */
Wnode.prototype.descendant = function () {
	"use strict";
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
	"use strict";
	// if set, append all attributes (*class)
	// 
	if (typeof attrs !== "undefined") { 
		for (var j in attrs) {
			if (j !== "class") {
				if (j !== "style") {
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
Wnode.prototype.setStyle = function (node, style, j) {
	"use strict";
	// if set, append all styles (*class)
	//
	if (typeof style !== "undefined") { 
		for (j in style) {
			node.style[j.replace(/^float$/i, "cssFloat")] = style[j];
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
	"use strict";
	if (data) el.data = data || {};
	return this;
};

/**
 * [checkInit description]
 * @param  {[type]} el [description]
 * @return {[type]}    [description]
 */
Wnode.prototype.checkInit = function (el, conf) {
	"use strict";
	var keepRunning = true;
	if ("init" in conf && typeof conf.init === "function") {
		keepRunning = conf.init.call(el);
		!keepRunning && el.abort();
	}
	return this;
};

/**
 * [checkInit description]
 * @param  {[type]} el [description]
 * @return {[type]}    [description]
 */
Wnode.prototype.checkEnd = function (el, conf) {
	"use strict";
	"end" in conf &&
	typeof conf.end === "function" &&
	this.root.endFunctions.push(function () {conf.end.call(el);});
	return this;
};

Wnode.prototype.setEvents = function (el, conf) {
	"use strict";
	var i, 
		self = this;
	for (i in this.events) (function (name) {
		var j;
		if (name in conf) {
			j = name.match(/on(.*)/)[1].toLowerCase();
			NS.events.on(el, j, function (e) {
				conf[name].call(self, e);
			});
		}
	})(i);
		
	return this;
};

/**
 * render method for the Wnode
 */
Wnode.prototype.render = function () {
	"use strict";

	// 
	this.WIDGZARD = true;

	var conf = this.conf,
		node = this.node,
		tmp, i, j, k;

	// set attributes and styles
	// 
	this.setAttrs(node, conf.attrs)
		.setStyle(node, conf.style)
		.setEvents(node, conf)
		.setData(this, conf.data)
		.checkInit(this, conf)
		.checkEnd(this, conf);

	// if `html` key is found on node conf 
	// inject its value
	//
	if (typeof conf.html !== "undefined") {
		node.innerHTML = replaceDataInHTML(conf.html, this.data);
	}

	/**
	 * ABSOLUTELY EXPERIMENTAL 2WDB
	 */
	if (tmp = node.getAttribute('wwdb')) {
		node.removeAttribute('wwdb');
		i = NS.checkNs(tmp, this);
		if (i !== undefined) {
			j = ("this." + tmp).split(".");
			k = j.pop();
			i = eval(j.join("."));
			k in i && NS.events.ww.on(i, k, node);
		}	
	}
	// 2WDB end

	// if `text` is found on node conf
	// it will be appended
	//  
	if (typeof conf.text !== "undefined") {
		tmp = document.createTextNode("" + conf.text);
		node.appendChild(tmp);
	}

	// if the node configuration has a `__nodeIdentifier` key
	// (and a String value), the node can be reached 
	// from all others callback invoking
	// this.getNode(keyValue)
	//
	if (typeof conf[__nodeIdentifier] !== "undefined") {
		this.map[conf[__nodeIdentifier]] = this;
	}
	
	// if the user specifies a node the is not the target 
	// passed to the constructor we use it as destination node
	// (node that in the constructor the node.target is always
	// the target passed)
	// 
	(conf.target || this.target.node).appendChild(node);

	if (!("childrens" in (conf.target || this.target))) {
		(conf.target || this.target).childrens = [];
	}
	(conf.target || this.target).childrens.push(this);

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