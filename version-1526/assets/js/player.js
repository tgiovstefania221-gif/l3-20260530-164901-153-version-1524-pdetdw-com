(function () {
  var hlsPromise = null;
  var hlsUrl = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js';

  function loadHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }

    if (hlsPromise) {
      return hlsPromise;
    }

    hlsPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = hlsUrl;
      script.async = true;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return hlsPromise;
  }

  function prepareVideo(video, stream) {
    if (!video || !stream) {
      return Promise.reject(new Error('stream'));
    }

    if (video.dataset.ready === '1') {
      return Promise.resolve();
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.dataset.ready = '1';
      return Promise.resolve();
    }

    return loadHls().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        var hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false
        });

        hls.loadSource(stream);
        hls.attachMedia(video);
        video.dataset.ready = '1';
        video._hls = hls;

        return new Promise(function (resolve) {
          hls.on(Hls.Events.MANIFEST_PARSED, resolve);
          window.setTimeout(resolve, 1500);
        });
      }

      video.src = stream;
      video.dataset.ready = '1';
      return Promise.resolve();
    });
  }

  function startPlayback(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.play-cover');
    var stream = video ? video.getAttribute('data-stream') : '';

    if (button) {
      button.classList.add('is-hidden');
    }

    prepareVideo(video, stream).then(function () {
      return video.play();
    }).catch(function () {
      if (button) {
        button.classList.remove('is-hidden');
      }
    });
  }

  function bindPlayer(shell) {
    var button = shell.querySelector('.play-cover');
    var video = shell.querySelector('video');

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        startPlayback(shell);
      });
    }

    if (video) {
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      });
    }

    shell.addEventListener('click', function (event) {
      if (event.target.closest('button') || event.target.closest('video')) {
        return;
      }

      startPlayback(shell);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('.video-shell')).forEach(bindPlayer);
  });
})();
