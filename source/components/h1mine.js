// eslint-disable-next-line no-unused-vars
var t = {
    tag: 'h1',
    html: "#PARAM{html} <span style='font-size:.5em'>lazy</span>",
    data: {
        times: 0,
        hoverColor: '#PARAM{hoverColor|true}',
        color: '#PARAM{color|red}'
    },
    onClick: function () {
        var self = this,
            $elf = this.node,
            times = ++self.data.times;

        $elf.innerHTML = 'clicked ' + times + ' time' + (times === 1 ? '' : 's');
    },
    onMouseover: function (e) {
        this.data.hoverColor && (this.node.style.color = this.data.color);
    },
    onMouseout: function (e) {
        this.data.hoverColor && (this.node.style.color = 'black');
    }
};
