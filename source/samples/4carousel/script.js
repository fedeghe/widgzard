+function () {
    var fv = document.getElementById('FV'),
        fi = document.getElementById('FI'),
        v = document.getElementById('V'),
        i = document.getElementById('I'),
        href = document.location.href,
        vid = !!(href.match(/[\?|&]video/)),
        fs = !!(href.match(/[\?|&]fs/));
    if (vid && fs) {
        fv.className = 'active';
    } else if (!vid && fs) {
        fi.className = 'active';
    } else if (vid && !fs) {
        v.className = 'active';
    } else if (!vid && !fs) {
        i.className = 'active';
    }
}();

+function () {
    var s = BASE.utils.getViewportSize(),
        video = document.location.href.match(/video/),
        fulls = document.location.href.match(/fs/),
        trg = document.getElementById('target'),
        size = [640, 360],
        w = (fulls ? s.width : size[0]),
        h = (fulls ? s.height : size[1]);

    trg.style.width = w + 'px';
    trg.style.height = h + 'px';

    if (fulls) {
        document.body.style.padding = '0px';
    }

    if (video)
        CubeCarousel({
            target: trg,
            width: w,
            height: h,
            transitionTime: .5,
            controls: false,
            videos: [{
                // mp4: 'video/The_Fourth_Phase_TEASER.mp4'
                mp4: 'https://static.videezy.com/system/resources/previews/000/002/454/original/out-of-the-box-hd-stock-video.mp4'
            }, {
                // mp4: 'video/motocross.mp4'
                mp4: 'https://static.videezy.com/system/resources/previews/000/004/950/original/Snow_Day_4K_Living_Background.mp4'
            }, {
                mp4: 'https://static.videezy.com/system/resources/previews/000/004/936/original/Forest_Sun_4K_Living_Background.mp4'
            }, {
                mp4: 'https://static.videezy.com/system/resources/previews/000/005/341/original/Earth_Spin_Medium.mp4'
            }]
        });
    else
        CubeCarousel({
            target: trg,
            animation: 'linear', // ease-in-out
            width: w,
            height: h,
            mantainRatio: true,
            // invertedControl: false,
            transitionTime: .5, // speed
            showTime: 5, //time
            zoomEffect: 0.6,
            images: [
                '/samples/4carousel/img/snow/1.jpg',
                '/samples/4carousel/img/snow/2.jpg',
                '/samples/4carousel/img/snow/3.jpg',
                '/samples/4carousel/img/snow/4.jpg'
            ],
            urls: ['https://www.google.com/#q=css+animation', 'https://www.google.com/#q=jmvc.org', 'https://www.google.com/#q=npm+malta', 'https://www.google.com/#q=freakstyle+it']
        });
}();