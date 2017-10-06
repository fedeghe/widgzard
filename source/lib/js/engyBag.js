$NS$.engy.bag = {
    /**
     * The bag
     * @type {Object}
     */
    bag : {},

    /**
     * Setter for node properties in the Bag
     * @param {DOMNode} node  the node for the association
     * @param {Object Literal} props    properties that should be associated with the node
     */
    set : function (node, props) {
        var j;
        if (node in this.bag) {
            for (j in props) {
                this.bag[node][j] = typeof props[j] == 'function' ?
                    $NS$.util.delegate(props[j], node)
                    :
                    props[j];
            }
        } else {
            this.bag[node] = props;
        }
    },

    /**
     * [get description]
     * @param  {[type]} node [description]
     * @param  {[type]} prop [description]
     * @return {[type]}      [description]
     */
    get : function (node, prop) {
        return (node in this.bag && prop in this.bag[node]) ?
            this.bag[node][prop]
            :
            undefined;
    },
    del : function (node, prop) {

        if (!(node in this.bag)) throw new Error('Node not in bag');
        if (prop) {
            if (prop in this.bag[node]) {
                this.bag[node][prop] = null;
            }
        } else {
            this.cleanup(node);
        }
    },
    /**
     * clean the node if passed otherwise clean the whole bag
     * @param  {[type]} node [description]
     * @return {[type]}      [description]
     */
    cleanup : function (node) {
        if (node) {
            if (node in this.bag) {
                this.bag[node] = {};
            }
        } else {
            this.bag = {};
        }
    }
};
/*
var n = document.getElementById('trg1');
$NS$.engy.bag.set(n, {getParent : function () {return this.parentNode;}, prop2 : 'federico ghedina'});
$NS$.engy.bag.get(n, 'getParent')();
*/