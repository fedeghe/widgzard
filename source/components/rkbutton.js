// eslint-disable-next-line no-undef
t = {
    style: {
        display: 'inline-block'
    },
    data: {
        name: '#PARAM{name|the Panel}',
        func: '#PARAM{func}',
        orig: '#PARAM{orig}',
        pars: '#PARAM{pars}',
        panel: '#PARAM{panel}'
    },
    init: function () {
        var self = this,
            data = this.data,
            trg = this.getNode('panel').node;

        this.data.showPanel = function () {
            var canvas = self.getNode('canvas');
            // Widgzard.render({
            //  target: trg,
            //  content: [{
            //      style: {color:'white'},
            //      tag: 'span',
            //      html: data.func
            //  }]
            // }, true);
            Engy.render({
                target: trg,
                content: [{
                    component: 'rkpanel1',
                    params: {
                        label: data.name,
                        lab: data.func,
                        fields: data.panel,
                        func: function (i, v) {
                            data.pars[i] = parseFloat(v);
                            canvas.data.paint(last());
                        }
                    }
                }],

            }, true);

        };
        return true;
    },
    content: [{
        tag: 'button',
        html: '#PARAM{label}',
        onClick: function () {
            var self = this,
                data = self.parent.data,
                canvas = self.getNode('canvas');
            RK.setOrigin.apply(null, data.orig);
            last = function () {
                return RK[data.func].apply(null, data.pars)
            };

            data.showPanel();
            canvas.data.paint(last());
        }
    }]
}
