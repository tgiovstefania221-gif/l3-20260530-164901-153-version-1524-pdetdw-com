(function () {
  'use strict';

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var toggle = qs('[data-menu-toggle]');
    var panel = qs('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function setupSearchForms() {
    qsa('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = qs('input[name="q"]', form);
        if (!input || !input.value.trim()) {
          return;
        }
        input.value = input.value.trim();
      });
    });
  }

  function setupHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var prev = qs('[data-hero-prev]', hero);
    var next = qs('[data-hero-next]', hero);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot') || 0));
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupFilters() {
    qsa('[data-filter-toolbar]').forEach(function (toolbar) {
      var input = qs('[data-filter-input]', toolbar);
      var year = qs('[data-filter-year]', toolbar);
      var type = qs('[data-filter-type]', toolbar);
      var category = qs('[data-filter-category]', toolbar);
      var resultCount = qs('[data-result-count]', toolbar);
      var section = toolbar.closest('section') || document;
      var cards = qsa('[data-card]', section);
      var empty = qs('[data-empty-result]', section);

      if (toolbar.getAttribute('data-use-query') === 'true' && input) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query) {
          input.value = query;
        }
      }

      function applyFilter() {
        var keyword = normalize(input && input.value);
        var selectedYear = normalize(year && year.value);
        var selectedType = normalize(type && type.value);
        var selectedCategory = normalize(category && category.value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute('data-search'));
          var cardYear = normalize(card.getAttribute('data-year'));
          var cardType = normalize(card.getAttribute('data-type'));
          var cardCategory = normalize(card.getAttribute('data-category'));
          var matched = true;

          if (keyword && haystack.indexOf(keyword) === -1) {
            matched = false;
          }
          if (selectedYear && cardYear !== selectedYear) {
            matched = false;
          }
          if (selectedType && cardType !== selectedType) {
            matched = false;
          }
          if (selectedCategory && cardCategory !== selectedCategory) {
            matched = false;
          }

          card.style.display = matched ? '' : 'none';
          var wrap = card.closest('.ranking-card-wrap');
          if (wrap) {
            wrap.style.display = matched ? '' : 'none';
          }
          if (matched) {
            visible += 1;
          }
        });

        if (resultCount) {
          resultCount.textContent = '共 ' + visible + ' 部';
        }
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [input, year, type, category].forEach(function (control) {
        if (control) {
          control.addEventListener('input', applyFilter);
          control.addEventListener('change', applyFilter);
        }
      });

      applyFilter();
    });
  }

  function setupPlayers() {
    qsa('[data-player-shell]').forEach(function (shell) {
      var video = qs('[data-player-video]', shell);
      var cover = qs('[data-player-cover]', shell);
      var button = qs('[data-play-trigger]', shell);
      var hlsInstance = null;

      if (!video || !button) {
        return;
      }

      function loadAndPlay() {
        var source = button.getAttribute('data-video-url');
        if (!source) {
          button.textContent = '播放源暂不可用';
          return;
        }

        if (cover) {
          cover.classList.add('is-hidden');
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          video.play().catch(function () {});
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          if (hlsInstance) {
            hlsInstance.destroy();
          }
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
          hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              button.textContent = '播放失败，请刷新重试';
              if (cover) {
                cover.classList.remove('is-hidden');
              }
            }
          });
          return;
        }

        video.src = source;
        video.play().catch(function () {
          button.textContent = '当前浏览器不支持 HLS 播放';
          if (cover) {
            cover.classList.remove('is-hidden');
          }
        });
      }

      button.addEventListener('click', loadAndPlay);
      if (cover) {
        cover.addEventListener('dblclick', loadAndPlay);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupSearchForms();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();
