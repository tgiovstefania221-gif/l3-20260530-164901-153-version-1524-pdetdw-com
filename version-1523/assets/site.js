(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var activeIndex = 0;

    function showHero(index) {
        if (!slides.length) {
            return;
        }
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === activeIndex);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === activeIndex);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            showHero(i);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showHero(activeIndex + 1);
        }, 5200);
    }

    var searchInput = document.querySelector('[data-card-search]');
    var yearFilter = document.querySelector('[data-year-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-grid .movie-card'));

    function applyCardFilters() {
        var word = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var minYear = yearFilter ? parseInt(yearFilter.value, 10) : NaN;
        cards.forEach(function (card) {
            var haystack = [
                card.getAttribute('data-title') || '',
                card.getAttribute('data-genre') || '',
                card.getAttribute('data-region') || '',
                card.getAttribute('data-year') || '',
                card.textContent || ''
            ].join(' ').toLowerCase();
            var year = parseInt(card.getAttribute('data-year') || '0', 10);
            var matchWord = !word || haystack.indexOf(word) !== -1;
            var matchYear = !minYear || year >= minYear;
            card.classList.toggle('search-hidden', !(matchWord && matchYear));
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyCardFilters);
    }
    if (yearFilter) {
        yearFilter.addEventListener('change', applyCardFilters);
    }

    var video = document.getElementById('movie-video');
    var trigger = document.querySelector('[data-play-trigger]');
    var playerReady = false;
    var hlsPlayer = null;

    function bindPlayer() {
        if (!video || playerReady) {
            return;
        }
        var src = video.getAttribute('data-src');
        if (!src) {
            return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsPlayer = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsPlayer.loadSource(src);
            hlsPlayer.attachMedia(video);
        } else {
            video.src = src;
        }
        playerReady = true;
    }

    function startPlayer() {
        if (!video) {
            return;
        }
        bindPlayer();
        if (trigger) {
            trigger.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
        }
    }

    if (trigger) {
        trigger.addEventListener('click', startPlayer);
    }
    if (video) {
        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayer();
            }
        });
    }

    window.addEventListener('pagehide', function () {
        if (hlsPlayer) {
            hlsPlayer.destroy();
            hlsPlayer = null;
        }
    });
})();
