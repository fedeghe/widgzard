/* eslint-disable no-console */
var target = document.getElementById('trg');

Engy.component('myli', {
    tag: 'li',
    html: '#PARAM{myhtml}',
    onClick: function () {
        console.log(this.node.innerHTML);
    },
    cb: function () {
        var self = this;
        setTimeout(function () {
            self.done();
        }, 100);
    }
});

Widgzard.render({
    target: target,
    data: {
        type: 'myli',
        strings: ['uno', 'dos', 'three', 'quatre', 'funf', 'secos']
    },
    style: {
        color: 'red',
        fontWeight: 'bold'
    },
    init: function () {
        var self = this,
            $elf = self.node;
        self.sub = {
            tag: 'ul',
            target: $elf,
            content: self.data.strings.map(s => ({
                component: self.data.type,
                params: { myhtml: s }
            })),
            cb: function () {
                console.log('inner');
                this.done();
            }
        };
        return true;
    },
    cb: function () {
        var self = this;
        this.subRender().then(function () {
            console.log('outer');
            console.log('TOTALE: ' + Widgzard.timer.get());
            self.done();
        });
    }
});
