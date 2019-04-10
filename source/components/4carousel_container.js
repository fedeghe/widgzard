// eslint-disable-next-line no-undef
SM = {
    // tag : 'div',
    attrs: {
        'class': 'flip-card'
    },
    data: {
        card: '#PARAM{card_component}',
        medias: '#PARAM{medias}',
        controls: '#PARAM{controls}',
        urls: '#PARAM{urls}',
        width: '#PARAM{width}',
        height: '#PARAM{height}',
        rWidth: '#PARAM{rWidth}',
        rHeight: '#PARAM{rHeight}',
        showTime: '#PARAM{showTime}',
        descriptions: '#PARAM{descriptions}',
        transitionTime: '#PARAM{transitionTime}',
        zoomEffect: '#PARAM{zoomEffect}',
        carouselId: '#PARAM{carouselId}',
        invertedControl: '#PARAM{invertedControl}',
        mediaShowDurationBar: '#PARAM{mediaShowDurationBar}'
    },
    init: function () {
        var self = this,
            $elf = self.node,
            data = self.data;

        data.count = data.medias.length;
        data.calc = function () {
            var a2 = Math.atan(2 / 9),
                l = 1000 / Math.cos(a2),
                d = l * Math.sin(a2);
            return d;
        };

        $elf.style.width = data.rWidth + 'px';
        $elf.style.height = data.rHeight + 'px';
        return true;
    },
    content: [{
        attrs: {
            'class': 'flip-card-content'
        },
        init: function () {
            var self = this,
                $elf = self.node,
                data = self.parent.data,
                l = data.count;

            $elf.style.width = data.width + 'px';
            $elf.style.height = data.height + 'px';
            data.stage = {
                target: $elf,
                content: []
            };
            data.videoStates = new Array(l).fill(0);
            function push (index, mediaIndex) {
                data.stage.content.push({
                    component: data.card,
                    wid: 'side_' + index,
                    params: {
                        stared: false,
                        index: '' + index,
                        url: data.urls[mediaIndex],
                        src: data.medias[mediaIndex] || null,
                        controls: data.controls,
                        w: data.width,
                        h: data.height,
                        carouselId: data.carouselId,
                        mediaIndex: mediaIndex,
                        showTime: data.showTime,
                        transitionTime: data.transitionTime,
                        mediaShowDurationBar: data.mediaShowDurationBar,
                        description: data.descriptions[mediaIndex],
                        videoStates: data.videoStates
                    }
                });
            }
            push(0, 0);
            push(1, 1);
            push(2, 2);
            push(3, l - 1);
            return true;
        },
        cb: function () {
            var self = this,
                $elf = self.node,
                data = self.parent.data,
                step = 90,
                current = 0,
                interval = setInterval(function () { }, 1E9),
                versus = 1,
                isMobile = Widgzard.utils.isMobile(),
                mobTo,
                sign = self.parent.data.invertedControl ? -1 : 1,
                // eslint-disable-next-line no-unused-vars
                REF;

            Engy.render(data.stage).then(function (r) { REF = r; });

            function start () {
                interval = window.setInterval(forward, data.showTime + data.transitionTime);
            }

            function mod0X (i, mod) {
                while (i < 0) i += mod;
                return i % mod;
            }

            function forward () {
                if (!document.hasFocus()) return;
                versus = sign;
                lets();
            }
            function backward () {
                if (!document.hasFocus()) return;
                versus = -sign;
                lets();
            }

            function lets () {
                current += versus;
                var prevMediaIndex = mod0X(current - 1, data.count),
                    nextMediaIndex = mod0X(current + 1, data.count),
                    prevIndex = mod0X(current - 1, 4),
                    nextIndex = mod0X(current + 1, 4);

                if (data.count > 4) {
                    Widgzard.Channel.get(data.carouselId).pub('updateMedia', [
                        prevIndex,
                        prevMediaIndex,
                        data.medias[prevMediaIndex]
                    ]);
                    Widgzard.Channel.get(data.carouselId).pub('currentIndex', [mod0X(current, 4)]);
                    Widgzard.Channel.get(data.carouselId).pub('updateMedia', [
                        nextIndex,
                        nextMediaIndex,
                        data.medias[nextMediaIndex]
                    ]);
                }

                go();
            }

            function doArrow (e) {
                switch (e.keyCode) {
                    case 39: forward(); break;
                    case 37: backward(); break;
                    default:break;
                }
            }

            function switchArrows (f) {
                return function () {
                    Widgzard.events[f ? 'on' : 'off'](window, 'keyup', doArrow);
                };
            }

            function go () {
                var tmp = -step * current,
                    index = mod0X(current, 4);
                Widgzard.Channel.get(data.carouselId).pub('move_to', [index]);
                Widgzard.css.style($elf, {
                    'transform': 'scale(' + data.zoomEffect + ') rotateY(' + (tmp + versus * step / 2) + 'deg)',
                    '-o-transform': 'scale (' + data.zoomEffect + ') rotatey(' + (tmp + versus * step / 2) + 'deg)',
                    '-webkit-transform': 'scale (' + data.zoomEffect + ') rotateY(' + (tmp + versus * step / 2) + 'deg)',
                    '-ms-transform': 'scale (' + data.zoomEffect + ') rotateY(' + (tmp + versus * step / 2) + 'deg)'
                });
                window.setTimeout(function () {
                    Widgzard.css.style($elf, {
                        'transform': 'scale(1) rotateY(' + tmp + 'deg)',
                        '-o-transform': 'scale (1) rotatey(' + tmp + 'deg)',
                        '-webkit-transform': 'scale (1) rotateY(' + tmp + 'deg)',
                        '-ms-transform': 'scale (1) rotateY(' + tmp + 'deg)'
                    });
                }, 1000 * data.transitionTime);
            }

            function stop () {
                window.clearInterval(interval);
            }

            Widgzard.Channel.get(data.carouselId).sub('clicked', function (e, index) {
                var i = parseInt(index, 10);
                data.urls
                    && i in data.urls
                    && data.urls[i]
                    && window.open(data.urls[i]);
            });

            // for video
            Widgzard.Channel.get(data.carouselId).sub('ended', forward);
            Widgzard.Channel.get(data.carouselId).sub('clicked_left', backward);
            Widgzard.Channel.get(data.carouselId).sub('clicked_right', forward);
            Widgzard.Channel.get(data.carouselId).pub('move_to', [0]);

            switch (data.card) {
                case '4card_video': break;
                case '4card_img':
                    start();
                    if (isMobile) {
                        Widgzard.events.on($elf, 'click', function () {
                            stop();
                            mobTo && clearTimeout(mobTo);
                            mobTo = window.setTimeout(start, 2 * data.showTime);
                        });
                    } else {
                        Widgzard.events.on($elf, 'mouseenter', stop);
                        Widgzard.events.on($elf, 'mouseleave', start);
                    }
                    break;
                default:break;
            }
            Widgzard.events.on($elf, 'mouseenter', switchArrows(true));
            Widgzard.events.on($elf, 'mouseleave', switchArrows(false));
            self.done();
        }
    }]
// eslint-disable-next-line eol-last
};