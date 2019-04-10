// var Wid = getWidgzard();
(function () {
    var ident = +new Date();

    // eslint-disable-next-line complexity
    function carousel (opts) {
        var target = opts.target || document.body,
            width = opts.width || 600,
            height = opts.height || 300,
            persp = opts.persp || 1200,
            transitionTime = (opts.transitionTime || 1.2) / 2,
            showTime = (opts.showTime || 3) * 1000,
            images = opts.images,
            videos = opts.videos,
            descriptions = opts.descriptions,
            mediaShowDurationBar = !!opts.mediaShowDurationBar,
            zoomEffect = opts.zoomEffect || 0.6,
            urls = opts.urls,
            getReal = function (s) {
                return (s * persp) / (persp + s / 2);
            },
            w = getReal(width),
            h = w * height / width,
            midW = w / 2,
            controls = opts.controls,
            invertedControl = !!(opts.invertedControl),
            animation = opts.animation || 'ease-in-out',
            id = 'CAR_' + ident++,

            engyParams = {
                target: target,
                attrs: {
                    class: 'four_carousel'
                },
                content: [{
                    component: '4carousel_container',
                    params: {
                        card_component: videos ? '4card_video' : '4card_img',
                        medias: images || videos,
                        urls: urls,
                        width: w,
                        height: h,
                        rWidth: width,
                        rHeight: height,
                        carouselId: id,
                        showTime: showTime,
                        controls: controls,
                        transitionTime: transitionTime,
                        zoomEffect: zoomEffect,
                        invertedControl: invertedControl,
                        descriptions: descriptions,
                        mediaShowDurationBar: mediaShowDurationBar
                    }
                }],
                cb: function () {
                    var self = this,
                        $elf = self.node,
                        cls = id,
                        style = document.createElement('style');

                    style.innerHTML = '.' + cls + ' .flip-card {'
                            + 'position: relative;'
                            + 'perspective: ' + persp + 'px;'
                            + '-webkit-perspective: ' + persp + 'px;'
                            + '-ms-perspective: ' + persp + 'px;'
                            + '-moz-perspective: ' + persp + 'px;'
                            + 'perspective-origin: center center;'
                            + 'background-color:transparent;'
                        + '}'
                        + '.' + cls + ' .flip-card .flip-card-content {'
                            + 'width: 100%;'
                            + 'height: 100%;'
                            + 'position: absolute;'
                            + 'left:' + ((width - w) / 2) + 'px;'
                            + 'top:' + ((height - h) / 2) + 'px;'
                            + 'transform-style: preserve-3d;'
                            + 'transition: all ' + transitionTime + 's ' + animation + ';'
                            + '-webkit-transform-style: preserve-3d;'
                            + '-webkit-transition: all ' + transitionTime + 's ' + animation + ';'
                            + '-ms-transform-style: preserve-3d;'
                            + '-ms-transition: all ' + transitionTime + 's ' + animation + ';'
                            + '-moz-transform-style: preserve-3d;'
                            + '-moz-transition: all ' + transitionTime + 's ' + animation + ';'
                        + '}'
                        + '.' + cls + ' .flip-card .flip-card-content .flip-card-side-0{ '
                            + 'transform: translateZ(' + midW + 'px);'
                            + '-webkit-transform: translateZ(' + midW + 'px);'
                            + '-ms-transform: translateZ(' + midW + 'px);'
                            + '-moz-transform: translateZ(' + midW + 'px);'
                        + '}'
                        + '.' + cls + ' .flip-card .flip-card-content .flip-card-side-1{'
                            + 'transform: rotateY(90deg) translateZ(' + midW + 'px);'
                            + '-webkit-transform: rotateY(90deg) translateZ(' + midW + 'px);'
                            + '-ms-transform: rotateY(90deg) translateZ(' + midW + 'px);'
                            + '-moz-transform: rotateY(90deg) translateZ(' + midW + 'px);'
                        + '}'
                        + '.' + cls + ' .flip-card .flip-card-content .flip-card-side-2{'
                            + 'transform: rotateY(180deg) translateZ(' + midW + 'px);'
                            + '-webkit-transform: rotateY(180deg) translateZ(' + midW + 'px);'
                            + '-ms-transform: rotateY(180deg) translateZ(' + midW + 'px);'
                            + '-moz-transform: rotateY(180deg) translateZ(' + midW + 'px);'
                        + '}'
                        + '.' + cls + ' .flip-card .flip-card-content .flip-card-side-3{'
                            + 'transform: rotateY(270deg) translateZ(' + midW + 'px);'
                            + '-webkit-transform: rotateY(270deg) translateZ(' + midW + 'px);'
                            + '-ms-transform: rotateY(270deg) translateZ(' + midW + 'px);'
                            + '-moz-transform: rotateY(270deg) translateZ(' + midW + 'px);'
                        + '}';
                    $elf.className += ' ' + cls;
                    $elf.appendChild(style);
                    this.done();
                }
            };

        Widgzard.events.ready(function () {
            Engy.render(engyParams);
        });
    }
    window.CubeCarousel = carousel;
})();
