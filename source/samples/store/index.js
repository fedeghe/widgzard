/* eslint-disable no-console */

var target = document.getElementById('trg'),
    actions = (function () {
        const initState = {
            num: 10,
            name: 'Federico',
            surname: 'Ghedina'
        };
        function reducer1 (state = initState, actionType, params) {
            var s = { ...state };
            switch (actionType) {
                case 'INCREMENT':
                    s.num++;
                    break;
                case 'DECREMENT':
                    s.num--;
                    break;
                case 'RESET':
                    return initState;
                case 'RENAME':
                    s.name = params.name;
                    break;
                default: ;
            }
            return s;
        }

        var store = Widgzard.getStore(reducer1, initState);

        store.subscribe((oldState, newState, action) => {
            console.log('----------');
            console.log(`ACTION dispatched: ${action}`);
            console.log('previous state: ');
            console.log(oldState);
            console.log('new state: ');
            console.log(newState);
            console.log('\n\n');
        });
        store.subscribe((oldState, newState) => {
            Widgzard.Channel.get('state').pub('dataChanged', newState);
        });

        return {
            increment: function () {
                store.dispatch({ type: 'INCREMENT' });
            },
            decrement: function () {
                store.dispatch({ type: 'DECREMENT' });
            },
            reset: function () {
                store.dispatch({ type: 'RESET' });
            },
            rename: function (name) {
                store.dispatch({ type: 'RENAME', name: name });
            },
            getState: function () {
                return store.getState();
            }
        };
    })();

// now render something
Widgzard.render({
    target: target,
    data: {
        prova: ''
    },
    content: [{
        tag: 'input',
        attrs: {
            type: 'text'
        },
        cb: function () {
            var self = this,
                $elf = self.node,
                state = actions.getState();
            $elf.value = state.name;
            Widgzard.events.on($elf, 'input', function (e) {
                actions.rename(e.target.value);
            });
            this.done();
        },

        init: function () {
            var node = this.node;
            Widgzard.Channel.get('state').sub('nameChanged', function (v) {
                node.value = v;
            });
            return true;
        }
    }, {
        tag: 'button',
        html: 'decrement',
        onClick: function () { actions.decrement(); }
    }, {
        tag: 'button',
        html: 'increment',
        onClick: function () { actions.increment(); }
    }, {
        tag: 'button',
        html: 'reset',
        onClick: function () { actions.reset(); }
    }, {
        tag: 'p',
        init: function () {
            var node = this.node;
            Widgzard.Channel.get('state').sub('numberChanged', function (v) {
                node.innerHTML = v;
            });
            return true;
        },
        cb: function () {
            var state = actions.getState();
            this.node.innerHTML = state.num;
            this.done();
        }
    }],
    cb: function () {
        Widgzard.Channel.get('state').sub('dataChanged', function (data) {
            Widgzard.Channel.get('state').pub('numberChanged', data.num);
            Widgzard.Channel.get('state').pub('nameChanged', data.name);
        });
        this.done();
    }
});
