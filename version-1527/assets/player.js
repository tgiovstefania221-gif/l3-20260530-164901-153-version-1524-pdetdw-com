
import { H as Hls } from './hls-vendor.js';

function setText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

function startPlayer(root) {
  var video = root.querySelector('video');
  var cover = root.querySelector('.video-cover');
  var note = root.querySelector('.player-note');
  var stream = root.getAttribute('data-stream') || '';

  if (!video || !stream) {
    setText(note, '播放源暂不可用');
    return;
  }

  setText(note, '正在加载影片...');

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = stream;
    video.play().catch(function () {
      setText(note, '点击播放器继续播放');
    });
    if (cover) {
      cover.classList.add('hidden');
    }
    return;
  }

  if (Hls && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 90
    });
    hls.loadSource(stream);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play().catch(function () {
        setText(note, '点击播放器继续播放');
      });
      if (cover) {
        cover.classList.add('hidden');
      }
      setText(note, '');
    });
    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data && data.fatal) {
        setText(note, '播放遇到问题，请稍后重试');
      }
    });
    return;
  }

  setText(note, '播放遇到问题，请稍后重试');
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-player]').forEach(function (root) {
    var cover = root.querySelector('.video-cover');
    var button = root.querySelector('.play-button');
    var fired = false;

    function boot() {
      if (fired) {
        return;
      }
      fired = true;
      startPlayer(root);
    }

    if (cover) {
      cover.addEventListener('click', boot);
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        boot();
      });
    }
  });
});
