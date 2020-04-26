function initVideo(video, url) {
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', function () {
            video.play();
        });
    }

    video.addEventListener('click', function (e) {
        e.preventDefault();

        if (!video.classList.contains("video--fullscreen")) {
            video.classList.add('video--fullscreen');

            toggleControlsVisibility()
        }
    })
}

function toggleControlsVisibility() {
    const controls = document.querySelector('.controls');
    controls.classList.toggle('controls--visible');
}

function initControls() {
    const controls = document.querySelector('.controls');

    controls.querySelector('.back-button').addEventListener('click', function() {
        toggleControlsVisibility();
        document.querySelectorAll('.video').forEach(video => video.classList.remove('video--fullscreen'));
    })
}
