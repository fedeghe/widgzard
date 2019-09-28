/* eslint-disable no-undef */
(function () {
    var fv = document.getElementById('FV'),
        fi = document.getElementById('FI'),
        v = document.getElementById('V'),
        i = document.getElementById('I'),
        panel = document.getElementById('panel'),
        href = document.location.href,
        vid = !!(href.match(/[?|&]video/)),
        fs = !!(href.match(/[?|&]fs/));
    if (vid && fs) {
        fv.className = 'active';
    } else if (!vid && fs) {
        fi.className = 'active';
    } else if (vid && !fs) {
        v.className = 'active';
    } else if (!vid && !fs) {
        i.className = 'active';
    }
    if (fs) {
        panel.style.display = 'none';
    }
})();

(function () {
    var s = Widgzard.utils.getViewportSize(),
        video = document.location.href.match(/video/),
        fulls = document.location.href.match(/fs/),
        trg = document.getElementById('target'),
        size = [1280, 720],
        w = (fulls ? s.width : size[0]),
        h = (fulls ? s.height : size[1]),
        config = {};

    trg.style.width = w + 'px';
    trg.style.height = h + 'px';

    if (fulls) {
        document.body.style.padding = '0px';
    }

    if (video) {
        config = {
            target: trg,
            width: w,
            height: h,
            transitionTime: 0.5,
            controls: true,
            mediaShowDurationBar: true,
            videos: [
                // https://gist.github.com/jsturgis/3b19447b304616f18657
                { mp4: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
                { mp4: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
                { mp4: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
                { mp4: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
                { mp4: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4' }
            ]
            // urls: [
            //     'https://www.google.com/#q=css+animation',
            //     'https://www.google.com/#q=jmvc.org',
            //     'https://www.google.com/#q=npm+malta',
            //     'https://www.google.com/#q=freakstyle+it',
            //     'https://www.google.com/#q=npm+balle'
            // ]
        };
    } else {
        config = {
            target: trg,
            animation: 'linear', // ease-in-out
            width: w,
            height: h,
            // invertedControl: true,
            transitionTime: 0.4, // speed
            showTime: 5, // time
            // zoomEffect: 0.6,
            images: [
                'http://jmvc.org/node/widgzard//1.jpg',
                'http://jmvc.org/node/widgzard//2.jpg',
                'http://jmvc.org/node/widgzard//3.jpg',
                'http://jmvc.org/node/widgzard//4.jpg',
                'http://jmvc.org/node/widgzard//5.jpg',
                'http://jmvc.org/node/widgzard//6.jpg'
            ],
            urls: [
                'https://www.google.com/#q=css+animation',
                'https://www.google.com/#q=jmvc.org',
                'https://www.google.com/#q=npm+malta',
                'https://www.google.com/#q=freakstyle+it',
                'https://www.google.com/#q=npm+balle',
                'https://www.google.com/#q=npm+ridof'
            ]
        };
    }
    CubeCarousel(config);
})();
