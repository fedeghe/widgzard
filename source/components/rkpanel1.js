// eslint-disable-next-line no-undef
t = {
    style: {
        display: 'inline-block',
        color: 'white'
    },
    data: {
        lab: '#PARAM{lab|nothing}',
        fields: '#PARAM{fields}',
        func: '#PARAM{func}'
    },
    content: function () {
        var self = this,
            i, j = 0,
            nodes = [{
                html: self.data.lab
            }];


        for (i in self.data.fields) {
            (function (h) {
                nodes.push({
                    data: {
                        val: self.data.fields[i].value
                    },
                    content: [{
                        tag: 'label',
                        text: i
                    }, {
                        tag: 'input',
                        style: {
                            width: '300px'
                        },
                        attrs: {
                            wwdb: 'parent.data.val',
                            type: 'range',
                            min: self.data.fields[i].min,
                            max: self.data.fields[i].max,
                            step: self.data.fields[i].step,
                            value: self.data.fields[i].value
                        },
                        onInput: function () {
                            self.data.func(h, this.node.value);
                        }
                    }, {
                        tag: 'label',
                        text: self.data.fields[i].value,
                        style: {
                            width: '100px',
                            textAlign: 'left',
                            display: 'inline-block'
                        },
                        attrs: {
                            wwdb: 'parent.data.val'
                        }
                    }]
                });
            })(j++);
        }
        return nodes;
        // return [{
        //  html: self.data.lab,
        //  onClick: function() {
        //      this.parent.data.args.w = ~~this.parent.data.args.w + 1;
        //      this.parent.data.func();
        //  }
        // }];
    }
};
