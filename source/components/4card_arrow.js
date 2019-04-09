xxx = {
    data: {
        versus: '#PARAM{versus}',
        arrows: {
            left: '&#10096;',
            right: '&#10097;'
        },
        percWidth: 0.2
    },
    init: function () {
        var data = this.data;
        this.node.innerHTML = data.arrows[data.versus];
        this.attrs.class += (' arr-' + data.versus);
        return true;
    },
    // tag : 'div',
    attrs: {
        'class': 'arr unselect'
    },
    cb: function () {
        var self = this,
            $elf = self.node,
            data = self.data,
            versus = data.versus,
            pdata = self.parent.data,
            fsize = ~~(pdata.height * 0.1),
            styles = {
                fontSize: fsize + 'px',
                width: (~~(pdata.width) * data.percWidth) + 'px',
                height: pdata.height * 0.8 + 'px',
                lineHeight: pdata.height * 0.8 + 'px',
                top: pdata.height * 0.1 + 'px',
            };
        styles[versus] = '0px';

        Widgzard.css.style($elf, styles);
        Widgzard.Channel.get(pdata.carouselId).sub('clicked_' + versus, function () { $elf.style.color = 'white'; });
        Widgzard.Channel.get(pdata.carouselId).sub('out_' + versus, function () { $elf.style.color = 'transparent'; });
        Widgzard.events.on($elf, 'mouseover', function () { $elf.style.color = 'white'; });
        Widgzard.events.on($elf, 'mouseleave', function () { Widgzard.Channel.get(pdata.carouselId).pub('out_' + versus); });
        Widgzard.events.on($elf, 'click', function (e) { Widgzard.Channel.get(pdata.carouselId).pub('clicked_' + versus); });
        self.done();
    }
};