(function (){
    "use strict";
    function _emptyObjFun(){return {};}
    
    function _pushState(instance, newState) {
        var len = instance.states.length,
            oldState = instance.states[len - 1];
        instance.listeners.forEach(function (sub) {
            sub(oldState, newState);
        });
        instance.states[len] = newState;
    }
    
    function Store(reducer, state){
        this.reducer = reducer || _emptyObjFun;
        this.state = state || reducer();
        this.states = [this.state];
        this.listeners = [];
    }

    Store.prototype.getState = function () {
        return this.states[this.states.length - 1];
    };

    Store.prototype.dispatch = function (a) {
        if (!("type" in a)) {throw new Error("Actions needs a type");}
        var actionType = a.type,
            oldState = this.states[this.states.length - 1],
            newState = this.reducer(oldState, actionType),
            i;
        for (i in a) {
            if (i !== "type") {
                newState[i] = a[i];
            }
        }
        _pushState(this, newState);
    };

    Store.prototype.subscribe = function (s) {
        var self = this,
            p;
        this.listeners.push(s);
        p = this.listeners.length - 1;
        // return the unsubcribe
        //
        return function () {
            self.listeners = self.listeners.slice(0, p).concat(self.listeners.slice(p + 1));
        };
    };

    Store.prototype.all = function () {
        return this.states.concat();
    };

    Store.prototype.back = function (n) {
        var topIndex = this.states.length - 1,
            validIndex = topIndex - n,
            targetIndex = validIndex > -1 ? validIndex : 0,
            newState = this.states[targetIndex];
        _pushState(this, newState);
    };

    NS.getStore = function (reducer, initState) {
        return new Store(reducer, initState);
    };
}());