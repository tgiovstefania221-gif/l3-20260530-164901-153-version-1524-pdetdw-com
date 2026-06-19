(function () {
    window.setupMoviePlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var overlay = document.getElementById(options.overlayId);
        var trigger = document.getElementById(options.triggerId);
        var source = options.source;
        var hlsInstance = null;
        var started = false;

        if (!video || !source) {
            return;
        }

        function playVideo() {
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        function attachSource() {
            if (started) {
                playVideo();
                return;
            }

            started = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                video.addEventListener("loadedmetadata", playVideo, { once: true });
                playVideo();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true });
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MEDIA_ATTACHED, function () {
                    hlsInstance.loadSource(source);
                });
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    playVideo();
                });
                return;
            }

            video.src = source;
            video.addEventListener("loadedmetadata", playVideo, { once: true });
            playVideo();
        }

        function startPlayback(event) {
            if (event) {
                event.preventDefault();
            }
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            video.controls = true;
            attachSource();
        }

        if (overlay) {
            overlay.addEventListener("click", startPlayback);
        }

        if (trigger) {
            trigger.addEventListener("click", startPlayback);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hlsInstance && typeof hlsInstance.destroy === "function") {
                hlsInstance.destroy();
            }
        });
    };
})();
