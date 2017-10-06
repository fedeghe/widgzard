{
    function none(){return {};}
    
    function Store(reducer = none, state){
        this.reducer = reducer;
        this.state = state || reducer();
        this.states = [this.state];
        this.listeners = [];
    }

    function pushState(instance, newState) {
        const len = instance.states.length,
            oldState = instance.states[len - 1];
        instance.listeners.forEach((sub) => {
            sub({...oldState}, {...newState});
        })
        instance.states[len] = newState;
    }

    Store.prototype.getState = function () {
        return this.states[this.states.length - 1];
    };

    Store.prototype.dispatch = function (a) {
        if (!('type' in a)) throw new Error('Actions needs a type');
        const actionType = a.type;
        delete a.type;
        var oldState = this.states[this.states.length - 1],
            newState = {
                ...this.reducer(oldState, actionType),
                ...a
            };

        pushState(this, newState);
    };

    Store.prototype.subscribe = function (s) {
        var self = this;
        this.listeners.push(s);
        const p = this.listeners.length - 1;
        
        return () => {
            self.listeners = [
                ...self.listeners.slice(0, p), 
                ...self.listeners.slice(p + 1)
            ];
        }
    };

    Store.prototype.all = function () {
        return [...this.states];
    }

    Store.prototype.back = function (n) {
        const topIndex = this.states.length - 1,
            validIndex = topIndex - n,
            targetIndex = validIndex > -1 ? validIndex : 0,
            newState = this.states[targetIndex],
            oldState = this.states[topIndex];
        pushState(this, newState);
    }

    $NS$.getStore = function (reducer, initState) {
        return new Store(reducer, initState);
    };
}