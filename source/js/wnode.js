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
        self = this,
        mat, ev;

    for (i in self.conf) {
        mat = i.match(/^on([A-Z]{1}[a-z]*)$/);
        if (mat) {
            ev = mat[1].toLowerCase();
            (function (eventName) {
                NS.events.on(self.node, ev, function (e) {
                    self.conf[eventName].call(self, e);
                });
            })(i);
        }
    }
    return this;
};

Wnode.prototype.report = function () {
    window.JSON && console.log('json size : ' + JSON.stringify(this.conf).length);
    console.log('html size : ' + this.root.node.innerHTML.length);
};
