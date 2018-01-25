var Wid = getWidgzard();
(function () {

    var ident = +new Date;

    function carousel(opts) {
        var width = opts.width || 600,
            height = opts.height || 300,
            persp = opts.persp || 1200,
            transitionTime = (opts.transitionTime || 1.2) / 2,
            showTime = (opts.showTime || 3) * 1000,
            images = opts.images,
            videos = opts.videos,
            zoomEffect = opts.zoomEffect || 0.7,
            urls = opts.urls,
            target = opts.target || body,
            getReal = function (s) {
                return (s * persp) / (persp + s / 2);
            },
            w = getReal(width),
            h = w * height / width,
            controls = opts.controls,
            invertedControl = !!(opts.invertedControl),
            animation = opts.animation || 'ease-in-out',
            id = 'CAR_' + ident++;

        var o = {
            content: [{
                component: '4carousel_container',
                params: {
                    card_component: videos ? '4card_video' : '4card_img',
                    data: images,
                    videos: videos,
                    urls: urls,
                    width: w,
                    height: h,
                    rWidth: width,
                    rHeight: height,
                    id: id,
                    showTime: showTime,
                    controls: controls,
                    transitionTime: transitionTime,
                    zoomEffect: zoomEffect,
                    invertedControl: invertedControl
                }
            }],
            cb: function () {
                var self = this,
                    $elf = self.node,
                    cls = id,
                    style = document.createElement('style');

                style.innerHTML = '.' + cls + ' .flip-card {' +
                        // 'border: 3px solid black;'+
                        'position: relative;' +
                        'perspective: ' + persp + 'px;' +
                        '-webkit-perspective: ' + persp + 'px;' +
                        '-ms-perspective: ' + persp + 'px;' +
                        '-moz-perspective: ' + persp + 'px;' +
                        'perspective-origin: center center;' +
                        'background-color:transparent;' +
                    '}' +
                    '.' + cls + ' .unselect {' +
                        '-webkit-user-select: none;' +
                        '-moz-user-select: none;' +
                        '-ms-user-select: none;' +
                        'user-select: none;' +
                    '}' +
                    '.' + cls + ' .flip-card-content {' +
                        'width: 100%;' +
                        'height: 100%;' +
                        'position: absolute;' +
                        'left:' + ((width - w) / 2) + 'px;' +
                        'top:' + ((height - h) / 2) + 'px;' +
                        'font-size: 0;' +
                        'transform-style: preserve-3d;' +
                        'transition: all ' + transitionTime + 's ' + animation + ';' +
                        '-webkit-transform-style: preserve-3d;' +
                        '-webkit-transition: all ' + transitionTime + 's ' + animation + ';' +
                        '-ms-transform-style: preserve-3d;' +
                        '-ms-transition: all ' + transitionTime + 's ' + animation + ';' +
                        '-moz-transform-style: preserve-3d;' +
                        '-moz-transition: all ' + transitionTime + 's ' + animation + ';' +
                    '}' +
                    '.' + cls + ' .flip-card-side-0,' +
                    '.' + cls + ' .flip-card-side-1,' +
                    '.' + cls + ' .flip-card-side-2,' +
                    '.' + cls + ' .flip-card-side-3,' +
                    '.' + cls + ' .flip-card-side-4,' +
                    '.' + cls + ' .flip-card-side-5,' +
                    '.' + cls + ' .flip-card-side-6,' +
                    '.' + cls + ' .flip-card-side-7,' +
                    '.' + cls + ' .flip-card-side-8,' +
                    '.' + cls + ' .flip-card-side-9,' +
                    '.' + cls + ' .flip-card-side-10,' +
                    '.' + cls + ' .flip-card-side-11{' +
                        'background-color:black;' +
                        'width: 100%;' +
                        'position: absolute;' +
                        'height: 100%;' +
                        'display: block;' +

                        // comment to see back
                        // 'backface-visibility: hidden;'+
                        // '-webkit-backface-visibility: hidden;'+
                        // '-ms-backface-visibility: hidden;'+
                        // '-moz-backface-visibility: hidden;'+

                    '}' +

                    '.' + cls + ' .flip-card-side-0, .' + cls + ' .flip-card-side-4, .' + cls + ' .flip-card-side-8{ ' +
                        'transform: translateZ(' + w / 2 + 'px);' +
                        '-webkit-transform: translateZ(' + w / 2 + 'px);' +
                        '-ms-transform: translateZ(' + w / 2 + 'px);' +
                        '-moz-transform: translateZ(' + w / 2 + 'px);' +
                    '}' +
                    '.' + cls + ' .flip-card-side-1, .' + cls + ' .flip-card-side-5, .' + cls + ' .flip-card-side-9 {' +
                        'transform: rotateY(90deg) translateZ(' + w / 2 + 'px);' +
                        '-webkit-transform: rotateY(90deg) translateZ(' + w / 2 + 'px);' +
                        '-ms-transform: rotateY(90deg) translateZ(' + w / 2 + 'px);' +
                        '-moz-transform: rotateY(90deg) translateZ(' + w / 2 + 'px);' +
                    '}' +
                    '.' + cls + ' .flip-card-side-2,.' + cls + ' .flip-card-side-6, .' + cls + ' .flip-card-side-10 {' +
                        'transform: rotateY(180deg) translateZ(' + w / 2 + 'px);' +
                        '-webkit-transform: rotateY(180deg) translateZ(' + w / 2 + 'px);' +
                        '-ms-transform: rotateY(180deg) translateZ(' + w / 2 + 'px);' +
                        '-moz-transform: rotateY(180deg) translateZ(' + w / 2 + 'px);' +
                    '}' +
                    '.' + cls + ' .flip-card-side-3, .' + cls + ' .flip-card-side-7, .' + cls + ' .flip-card-side-11 {' +
                        'transform: rotateY(270deg) translateZ(' + w / 2 + 'px);' +
                        '-webkit-transform: rotateY(270deg) translateZ(' + w / 2 + 'px);' +
                        '-ms-transform: rotateY(270deg) translateZ(' + w / 2 + 'px);' +
                        '-moz-transform: rotateY(270deg) translateZ(' + w / 2 + 'px);' +
                    '}' +
                    '.' + cls + ' .arr{' +
                        'position:absolute;' +
                        'margin : 0 auto;' +
                        'text-align : center;' +
                        'color : transparent;' +
                        'cursor : pointer;' +
                    '}';
                $elf.className += cls;
                $elf.appendChild(style);
            }
        };

        Wid.events.ready(function () {
            o.target = target;
            Wid.Engy.render(o).then(function (p, r) {
                console.debug(r[0])
            });
        });
    }
    window.CubeCarousel = carousel;
})();