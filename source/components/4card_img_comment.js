// eslint-disable-next-line no-undef
CMP = {
    attrs: {
        class: 'description'
    },
    content: [{
        attrs: {
            class: 'container'
        },
        content: [{
            tag: 'h3',
            html: '#PARAM{description.title}'
        }, {
            tag: 'p',
            html: '#PARAM{description.description}'
        }]
    }]
// eslint-disable-next-line eol-last
};