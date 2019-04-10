// eslint-disable-next-line no-undef
t = {
    data: {
        onUpdate: '#PARAM{onUpdate}'
    },
    content: [{
        tag: 'label',
        text: '#PARAM{label}'
    }, {
        tag: 'input',
        style: {
            width: '300px'
        },
        attrs: {
            type: 'range',
            min: '#PARAM{min}',
            max: '#PARAM{max}',
            value: '#PARAM{value}'
        }
    }, {
        tag: 'label',
        text: '#PARAM{value}'
    }]
// eslint-disable-next-line eol-last
};