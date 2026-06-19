(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('.hero');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var previous = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5600);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        startTimer();
      });
    });

    if (previous) {
      previous.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
    startTimer();
  }

  var searchForm = document.querySelector('.search-panel');
  var searchInput = document.getElementById('movie-search-input');
  var searchResults = document.getElementById('search-results');
  var emptyState = document.getElementById('empty-state');
  var heading = document.getElementById('search-heading');

  if (searchInput && searchResults) {
    var cards = Array.prototype.slice.call(searchResults.querySelectorAll('.movie-card'));
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applySearch(value) {
      var keyword = normalize(value);
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.textContent
        ].join(' ').toLowerCase();
        var matched = !keyword || text.indexOf(keyword) !== -1;

        card.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }

      if (heading) {
        heading.textContent = keyword ? '搜索结果：' + value : '影片结果';
      }
    }

    searchInput.value = initial;
    applySearch(initial);

    searchInput.addEventListener('input', function () {
      applySearch(searchInput.value);
    });

    if (searchForm) {
      searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        applySearch(searchInput.value);
      });
    }
  }
})();
