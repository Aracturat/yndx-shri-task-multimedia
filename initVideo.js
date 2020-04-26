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

		if (!video.classList.contains('video--fullscreen')) {
			video.classList.add('video--fullscreen');

			video.muted = false;
			toggleControlsVisibility();

			getContrastInput().value = 100;
			getBrightnessInput().value = 100;

			createContext(video);
		}
	});
}

function initControls() {
	getBackButton().addEventListener('click', function () {
		toggleControlsVisibility();

		setCurrentVideoFilters(100, 100);
		const currentVideo = getCurrentVideo();
		currentVideo.muted = true;

		currentVideo.classList.remove('video--fullscreen');
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

var context = null;
var analyzer = null;
var mediaElementSources = [];


async function createContext(video) {
	if (!context) {
		const AudioContext = window.AudioContext || window.webkitAudioСontext;
		context = new AudioContext();

		analyzer = context.createAnalyser();
		analyzer.fftSize = 512;
		analyzer.smoothingTimeConstant = 0.3;

		const scriptProcessor = context.createScriptProcessor();

		analyzer.connect(scriptProcessor);
		scriptProcessor.connect(context.destination);

		const dataArray = new Uint8Array(analyzer.frequencyBinCount);

		scriptProcessor.addEventListener('audioprocess', function () {
			analyzer.getByteFrequencyData(dataArray);

			const volume = Math.max(...dataArray) / (analyzer.fftSize / 2) * 100;

			drawVolume(volume);
		});

	}

	let mediaElementSource = mediaElementSources.find(e => e.video === video);

	if (!mediaElementSource) {
		mediaElementSource = {
			video: video,
			source: context.createMediaElementSource(video)
		};

		mediaElementSources.push(mediaElementSource)
	}

	mediaElementSource.source.connect(analyzer);

	return await context.resume();
}


function drawVolume(volume) {
	const volumeElement = document.querySelector('.volume');

	function internal() {
		volumeElement.style.width = `${volume}%`;
	}

	requestAnimationFrame(internal);
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
