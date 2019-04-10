// eslint-disable-next-line no-undef
SM = {
    // tag : 'div',
    data: {
        width: '#PARAM{w}',
        height: '#PARAM{h}',
        index: '#PARAM{index}',
        src: '#PARAM{src}',
        carouselId: '#PARAM{carouselId}',
        percWidth: 0.2,
        url: '#PARAM{url}',
        controls: '#PARAM{controls}',
        uid: '' + Widgzard.utils.uniqueid,
        mediaShowDurationBar: '#PARAM{mediaShowDurationBar}',
        playing: false
    },

    content: [{
        tag: 'video',
        attrs: {
            'data-id': '#PARAM{mediaIndex}'
        },
        init: function () {
            var self = this,
                $elf = self.node;

            if (self.parent.data.controls) {
                $elf.controls = true;
            }
            return true;
        },
        content: [{
            tag: 'source',
            attrs: {
                type: 'video/mp4'
            },
            cb: function () {
                var self = this,
                    $elf = this.node,
                    data = self.parent.parent.data,
                    src = data.src;
                if (!('mp4' in src)) {
                    Widgzard.dom.remove($elf);
                } else {
                    $elf.src = src.mp4;
                }
                this.done();
            }
        }, {
            tag: 'source',
            attrs: {
                type: 'video/webm'
            },
            cb: function () {
                var self = this,
                    $elf = this.node,
                    data = self.parent.parent.data,
                    src = data.src;
                if (!('webm' in src)) {
                    Widgzard.dom.remove($elf);
                } else {
                    $elf.src = src.webm;
                }
                this.done();
            }
        }, {
            tag: 'source',
            attrs: {
                type: 'video/ogg'
            },
            cb: function () {
                var self = this,
                    $elf = this.node,
                    data = self.parent.parent.data,
                    src = data.src;
                if (!('ogg' in src)) {
                    Widgzard.dom.remove($elf);
                } else {
                    $elf.src = src.ogg;
                }
                this.done();
            }
        }],
        cb: function () {
            var self = this,
                $elf = self.node,
                pdata = self.parent.data,
                styles = {
                    width: pdata.width + 'px !important',
                    height: pdata.height + 'px !important'
                };

            pdata.url && (styles.cursor = 'pointer');
            Widgzard.css.style($elf, styles);

            $elf.width = pdata.width;
            $elf.height = pdata.height;

            Widgzard.Channel.get(pdata.carouselId).sub('move_to', function (num) {
                var itis = num === ~~self.parent.data.index;
                pdata.playing = itis;
                $elf[itis ? 'play' : 'pause']();
            });

            if (self.parent.data.index === 0) {
                $elf.autoplay = true;
            }

            Widgzard.events.on($elf, 'ended', function (e) {
                Widgzard.Channel.get(pdata.carouselId).pub('ended');
                pdata.playing = false;
            });

            Widgzard.events.on($elf, 'click', function (e) {
                Widgzard.Channel.get(pdata.carouselId).pub('clicked', [e, parseInt($elf.getAttribute('data-id'), 10)]);
            });

            // once just for the first autoplay
            Widgzard.events.on($elf, 'canplay', function () {
                if (parseInt(pdata.index, 10) === 0 && !pdata.started) {
                    pdata.started = true;
                    window.setTimeout(function () {
                        $elf.play(); // does not work if there is no user event
                        pdata.playing = true;
                    }, 500);
                }
                self.done();
            });

            pdata.mediaShowDurationBar && Widgzard.events.on($elf, 'timeupdate', function () {
                if (pdata.playing) {
                    var current = $elf.currentTime,
                        duration = $elf.duration;
                    Widgzard.Channel.get(pdata.uid).pub('updateProgress', [Math.ceil(100 * current / duration)]);
                }
            });

            Widgzard.Channel.get(pdata.carouselId).sub('currentIndex', function (index) {
                // console.log(index, pdata.index);
                if (parseInt(pdata.index, 10) === index) {
                    window.setTimeout(function () {
                        $elf.play();
                        pdata.playing = true;
                    }, 500);
                }
            });

            Widgzard.Channel.get(pdata.carouselId).sub('updateMedia', function (index, mediaIndex, media) {
                var desc;
                if (index === ~~pdata.index) {
                    desc = self.descendant(0);
                    desc.node.setAttribute('src', media.mp4);
                    $elf.load();
                    $elf.currentTime = 0;
                    $elf.dataset.id = mediaIndex;
                }
            });
        }
    }, {
        component: '4card_img_comment',
        params: { description: '#PARAM{description}' },
        data: { description: '#PARAM{description}' },
        willRender: function () {
            return this.data.description;
        }
    }, {
        component: '4card_arrow',
        params: { versus: 'left' }
    }, {
        component: '4card_arrow',
        params: { versus: 'right' }
    }, {
        style: {
            position: 'absolute',
            bottom: '0px',
            left: '0px',
            width: '0%'
        },
        attrs: {
            class: 'durationBar'
        },
        willRender: function () {
            return this.parent.data.mediaShowDurationBar;
        },
        cb: function () {
            var self = this,
                $elf = this.node,
                pdata = self.parent.data;
            Widgzard.Channel.get(pdata.uid).sub('updateProgress', function (perc) {
                $elf.style.width = perc + '%';
            });
            this.done();
        }
    }],
    init: function () {
        this.node.className = 'flip-card-side flip-card-side-' + this.data.index;
        return true;
    }
// eslint-disable-next-line eol-last
};