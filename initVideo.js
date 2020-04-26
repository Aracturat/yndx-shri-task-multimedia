function initVideo(video, url) {
    if (Hls.isSupported()) {
        const hls = new Hls();
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

            toggleControlsVisibility();

            getContrastInput().value = 100;
            getBrightnessInput().value = 100;
        }
    });
}


function initControls() {
    getBackButton().addEventListener('click', function() {
        toggleControlsVisibility();

        setCurrentVideoFilters(100, 100);
        getCurrentVideo().classList.remove('video--fullscreen');
    });

    function qualityControlListener() {
        const contrastInput = getContrastInput();
        const brightnessInput = getBrightnessInput();

        const contrast = contrastInput.value;
        const brightness = brightnessInput.value;

        setCurrentVideoFilters(contrast, brightness);
    }

    getContrastInput().addEventListener('input', qualityControlListener);
    getBrightnessInput().addEventListener('input', qualityControlListener);
}

function getControls() {
    return document.querySelector('.controls');
}

function getBackButton() {
    return document.querySelector('.back-button')
}

function getContrastInput() {
    return document.getElementById('contrast');
}

function getBrightnessInput() {
    return document.getElementById('brightness');
}

function getCurrentVideo() {
    return document.querySelector('.video.video--fullscreen');
}

function setCurrentVideoFilters(contrast, brightness) {
    const currentVideo = getCurrentVideo();

    if (currentVideo) {
        currentVideo.style.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
    }
}

function toggleControlsVisibility() {
    getControls().classList.toggle('controls--visible');
}
