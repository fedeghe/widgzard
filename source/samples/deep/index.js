/* eslint-disable no-console */
var target = document.getElementById('trg');

Engy.component('myli', {
    tag: 'li',
    html: '#PARAM{myhtml}',
    onClick: function (e) {
        var step = 20,
            p = parseInt(this.node.style.paddingLeft, 10) || 0,
            sign = (e.clientX - 2 * step) > p ? 1 : -1;
        this.node.style.color = sign < 0 ? 'red' : 'green';
        this.node.style.paddingLeft = (p + sign * step) + 'px';
        console.log(this.node.innerHTML);
    }
});

Widgzard.render({
    target: target,
    data: {
        type: 'myli'
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
            // content: function () {
            //     var n = 1000,
            //         i = 0,
            //         ret = [];
            //     for (null; i <= n; i++) {
            //         ret.push({
            //             tag: 'li',
            //             text: (i * 2) + ''
            //         })
            //     }
            //     return ret;
            // }
            /**
             * The following works but:
             * - requires an IIFE
             * - is really slow compared to the previous due to engy parsing
             */
            content: (function () {
                var n = 1000,
                    i = 0,
                    ret = [];
                for (null; i <= n; i++) {
                    ret.push({
                        component: self.data.type,
                        params: { myhtml: (i * 2) + '' }
                    });
                }
                console.log('ret');
                console.log(ret);
                return ret;
            })()
        };
        return true;
    },
    cb: function () {
        var self = this;
        this.subRender().then(function () {
            console.log('Widgzard rendering time: ' + Widgzard.timer.get());
            self.report();
            self.done();
        });
    }
});
