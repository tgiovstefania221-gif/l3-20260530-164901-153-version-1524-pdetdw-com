(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(function (shell) {
            var video = shell.querySelector("video");
            var trigger = shell.querySelector(".play-trigger");
            if (!video || !trigger) {
                return;
            }
            var source = video.getAttribute("data-play");
            var started = false;
            var hls = null;

            function playVideo() {
                var playResult = video.play();
                if (playResult && typeof playResult.catch === "function") {
                    playResult.catch(function () {});
                }
            }

            function begin() {
                if (!source) {
                    return;
                }
                trigger.classList.add("is-hidden");
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
                    hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                    return;
                }
                video.src = source;
                video.addEventListener("loadedmetadata", playVideo, { once: true });
                playVideo();
            }

            trigger.addEventListener("click", begin);
            video.addEventListener("click", function () {
                if (!started) {
                    begin();
                }
            });
            window.addEventListener("pagehide", function () {
                if (hls) {
                    hls.destroy();
                    hls = null;
                }
            });
        });
    });
})();
