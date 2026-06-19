(function () {
  function loadWithHls(video, source) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return null;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return hls;
    }

    video.src = source;
    return null;
  }

  window.initMoviePlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var button = document.getElementById(options.buttonId);
    var source = options.source;
    var attached = false;
    var instance = null;

    if (!video || !button || !source) {
      return;
    }

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      instance = loadWithHls(video, source);
      video.setAttribute("controls", "controls");
    }

    function begin() {
      attach();
      button.classList.add("is-hidden");
      var promise = video.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          button.classList.remove("is-hidden");
        });
      }
    }

    button.addEventListener("click", begin);

    video.addEventListener("click", function () {
      if (video.paused) {
        begin();
      }
    });

    video.addEventListener("play", function () {
      button.classList.add("is-hidden");
    });

    video.addEventListener("pause", function () {
      if (video.currentTime === 0) {
        button.classList.remove("is-hidden");
      }
    });

    window.addEventListener("beforeunload", function () {
      if (instance && typeof instance.destroy === "function") {
        instance.destroy();
      }
    });
  };
}());
